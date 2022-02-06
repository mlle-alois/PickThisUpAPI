"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const Utils_1 = require("../Utils");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const consts_1 = require("../consts");
const eventRouter = express_1.default.Router();
exports.eventRouter = eventRouter;
eventRouter.post("/add", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const eventService = new impl_1.EventServiceImpl(connection);
            const id = await eventService.getMaxEventId() + 1;
            const title = req.body.title;
            const description = req.body.description;
            const dateHourStart = req.body.dateHourStart;
            const dateHourEnd = req.body.dateHourEnd;
            const maxNbPlaces = req.body.maxNbPlaces;
            const pictureId = req.body.pictureId;
            const zoneId = req.body.zoneId;
            if (title === undefined || description === undefined || dateHourStart === undefined ||
                dateHourEnd === undefined || maxNbPlaces === undefined || pictureId === undefined ||
                zoneId === undefined) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const dateHourCreation = Utils_1.DateUtils.getCurrentDate();
            const creatorId = await (0, Utils_1.getUserMailConnected)(req);
            if (creatorId instanceof models_1.LogError)
                return models_1.LogError.HandleStatus(res, creatorId);
            const statusId = await (0, Utils_1.isAdministratorConnected)(req) ? consts_1.VALIDATED_STATUS : consts_1.ON_ATTEMPT_STATUS;
            const event = await eventService.createEvent({
                eventId: id,
                eventTitle: title,
                eventDescription: description,
                dateHourStart: dateHourStart,
                dateHourEnd: dateHourEnd,
                dateHourCreation: dateHourCreation,
                eventMaxNbPlaces: maxNbPlaces,
                eventPitureId: pictureId,
                statusId: statusId,
                creatorId: creatorId,
                zoneId: zoneId
            });
            if (event instanceof models_1.LogError) {
                models_1.LogError.HandleStatus(res, event);
            }
            else {
                res.status(201);
                res.json(event);
            }
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const eventService = new impl_1.EventServiceImpl(connection);
        const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
        const eventList = await eventService.getAllValidatedEvents({
            limit,
            offset
        });
        res.json(eventList);
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const eventService = new impl_1.EventServiceImpl(connection);
        const id = req.params.id;
        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const event = await eventService.getEventById(Number.parseInt(id));
        if (event instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, event);
        else
            res.json(event);
    }
    catch (err) {
        next(err);
    }
});
eventRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
            const id = req.params.id;
            const title = req.body.title;
            const description = req.body.description;
            const dateHourStart = req.body.dateHourStart;
            const dateHourEnd = req.body.dateHourEnd;
            const maxNbPlaces = req.body.maxNbPlaces;
            const pictureId = req.body.pictureId;
            if (id === undefined || (title === undefined && description === undefined && dateHourStart === undefined &&
                dateHourEnd === undefined && maxNbPlaces === undefined && pictureId === undefined)) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await database_1.DatabaseUtils.getConnection();
            const eventService = new impl_1.EventServiceImpl(connection);
            const event = await eventService.updateEvent({
                eventId: Number.parseInt(id),
                eventTitle: title,
                eventDescription: description,
                dateHourStart: dateHourStart,
                dateHourEnd: dateHourEnd,
                eventMaxNbPlaces: maxNbPlaces,
                eventPitureId: pictureId
            });
            if (event instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, event);
            else
                res.json(event);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
eventRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const eventService = new impl_1.EventServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const success = await eventService.deleteEventsById(Number.parseInt(id));
            if (success)
                res.json(success);
            else
                res.status(404).end();
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
eventRouter.post("/register/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const eventService = new impl_1.EventServiceImpl(connection);
        const id = req.params.id;
        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const userMail = await (0, Utils_1.getUserMailConnected)(req);
        if (userMail instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, userMail);
        const participants = await eventService.registerEvent(Number.parseInt(id), userMail);
        if (participants instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, participants);
        else
            res.json(participants);
    }
    catch (err) {
        next(err);
    }
});
eventRouter.delete("/unregister/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const eventService = new impl_1.EventServiceImpl(connection);
        const id = req.params.id;
        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const userMail = await (0, Utils_1.getUserMailConnected)(req);
        if (userMail instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, userMail);
        const participants = await eventService.unregisterEvent(Number.parseInt(id), userMail);
        if (participants instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, participants);
        else
            res.json(participants);
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/getPastEventsByUser", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const eventService = new impl_1.EventServiceImpl(connection);
        const mail = await (0, Utils_1.getUserMailConnected)(req);
        if (mail instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, mail);
        const events = await eventService.getPastEventsByUser(mail);
        if (events instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, events);
        else
            res.json(events);
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/getFutureEventsByUser", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const eventService = new impl_1.EventServiceImpl(connection);
        const mail = await (0, Utils_1.getUserMailConnected)(req);
        if (mail instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, mail);
        const events = await eventService.getFutureEventsByUser(mail);
        if (events instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, events);
        else
            res.json(events);
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/getActualEventsByUser", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const eventService = new impl_1.EventServiceImpl(connection);
        const mail = await (0, Utils_1.getUserMailConnected)(req);
        if (mail instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, mail);
        const events = await eventService.getActualEventsByUser(mail);
        if (events instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, events);
        else
            res.json(events);
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/getValidatedEvents", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const eventService = new impl_1.EventServiceImpl(connection);
            const events = await eventService.getValidatedEvents();
            if (events instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, events);
            else
                res.json(events);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/getWaitingEvents", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const eventService = new impl_1.EventServiceImpl(connection);
            const events = await eventService.getWaitingEvents();
            if (events instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, events);
            else
                res.json(events);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/getRefusedEvents", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const eventService = new impl_1.EventServiceImpl(connection);
            const events = await eventService.getRefusedEvents();
            if (events instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, events);
            else
                res.json(events);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
eventRouter.put("/accept/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const eventService = new impl_1.EventServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const event = await eventService.acceptEvent(Number.parseInt(id));
            if (event instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, event);
            else
                res.json(event);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
eventRouter.put("/refuse/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const eventService = new impl_1.EventServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const event = await eventService.refuseEvent(Number.parseInt(id));
            if (event instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, event);
            else
                res.json(event);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
eventRouter.get("/getParticipants/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const eventService = new impl_1.EventServiceImpl(connection);
        const id = req.params.id;
        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const participants = await eventService.getParticipantsEvent(Number.parseInt(id));
        if (participants instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, participants);
        else
            res.json(participants);
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=event-router.js.map