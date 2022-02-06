"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carpoolRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const Utils_1 = require("../Utils");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const carpoolRouter = express_1.default.Router();
exports.carpoolRouter = carpoolRouter;
carpoolRouter.post("/add", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
        const connection = await database_1.DatabaseUtils.getConnection();
        const carpoolService = new impl_1.CarpoolServiceImpl(connection);
        const id = await carpoolService.getMaxCarpoolId() + 1;
        const street = req.body.street;
        const zipcode = req.body.zipcode;
        const city = req.body.city;
        const nbPlaces = req.body.nbPlaces;
        const eventId = req.body.eventId;
        if (street === undefined || zipcode === undefined || city === undefined ||
            nbPlaces === undefined || eventId === undefined) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }
        const conductorId = await (0, Utils_1.getUserMailConnected)(req);
        if (conductorId instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, conductorId);
        const carpool = await carpoolService.createCarpool({
            carpoolId: id,
            carpoolDepartureStreet: street,
            carpoolDepartureZipcode: zipcode,
            carpoolDepartureCity: city,
            nbPlaces: nbPlaces,
            eventId: eventId,
            conductorId: conductorId
        });
        if (carpool instanceof models_1.LogError) {
            models_1.LogError.HandleStatus(res, carpool);
        }
        else {
            res.status(201);
            res.json(carpool);
        }
    }
    res.status(403).end();
});
carpoolRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    const connection = await database_1.DatabaseUtils.getConnection();
    const carpoolService = new impl_1.CarpoolServiceImpl(connection);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");
    const carpool = await carpoolService.getCarpoolById(Number.parseInt(id));
    if (carpool instanceof models_1.LogError)
        models_1.LogError.HandleStatus(res, carpool);
    else
        res.json(carpool);
});
carpoolRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
        const id = req.params.id;
        const street = req.body.street;
        const zipcode = req.body.zipcode;
        const city = req.body.city;
        const nbPlaces = req.body.nbPlaces;
        if (id === undefined || (street === undefined && zipcode === undefined && city === undefined && nbPlaces === undefined)) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }
        const connection = await database_1.DatabaseUtils.getConnection();
        const carpoolService = new impl_1.CarpoolServiceImpl(connection);
        const carpool = await carpoolService.updateCarpool({
            carpoolId: Number.parseInt(id),
            carpoolDepartureStreet: street,
            carpoolDepartureZipcode: zipcode,
            carpoolDepartureCity: city,
            nbPlaces: nbPlaces
        });
        if (carpool instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, carpool);
        else
            res.json(carpool);
    }
    res.status(403).end();
});
carpoolRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
        const connection = await database_1.DatabaseUtils.getConnection();
        const carpoolService = new impl_1.CarpoolServiceImpl(connection);
        const id = req.params.id;
        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const success = await carpoolService.deleteCarpoolById(Number.parseInt(id));
        if (success)
            res.json(success);
        else
            res.status(404).end();
    }
    res.status(403).end();
});
carpoolRouter.post("/register/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    const connection = await database_1.DatabaseUtils.getConnection();
    const carpoolService = new impl_1.CarpoolServiceImpl(connection);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");
    const userMail = await (0, Utils_1.getUserMailConnected)(req);
    if (userMail instanceof models_1.LogError)
        return models_1.LogError.HandleStatus(res, userMail);
    const participants = await carpoolService.registerCarpool(Number.parseInt(id), userMail);
    if (participants instanceof models_1.LogError)
        models_1.LogError.HandleStatus(res, participants);
    else
        res.json(participants);
});
carpoolRouter.delete("/unregister/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    const connection = await database_1.DatabaseUtils.getConnection();
    const carpoolService = new impl_1.CarpoolServiceImpl(connection);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");
    const userMail = await (0, Utils_1.getUserMailConnected)(req);
    if (userMail instanceof models_1.LogError)
        return models_1.LogError.HandleStatus(res, userMail);
    const participants = await carpoolService.unregisterCarpool(Number.parseInt(id), userMail);
    if (participants instanceof models_1.LogError)
        models_1.LogError.HandleStatus(res, participants);
    else
        res.json(participants);
});
carpoolRouter.get("/getByEvent/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    const connection = await database_1.DatabaseUtils.getConnection();
    const carpoolService = new impl_1.CarpoolServiceImpl(connection);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");
    const carpools = await carpoolService.getCarpoolsByEvent(Number.parseInt(id));
    if (carpools instanceof models_1.LogError)
        models_1.LogError.HandleStatus(res, carpools);
    else
        res.json(carpools);
});
carpoolRouter.get("/getParticipants/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    const connection = await database_1.DatabaseUtils.getConnection();
    const carpoolService = new impl_1.CarpoolServiceImpl(connection);
    const id = req.params.id;
    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");
    const participants = await carpoolService.getCarpoolMembersById(Number.parseInt(id));
    if (participants instanceof models_1.LogError)
        models_1.LogError.HandleStatus(res, participants);
    else
        res.json(participants);
});
carpoolRouter.get("/getOldAdresses", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    const connection = await database_1.DatabaseUtils.getConnection();
    const carpoolService = new impl_1.CarpoolServiceImpl(connection);
    const mail = await (0, Utils_1.getUserMailConnected)(req);
    if (mail instanceof models_1.LogError)
        return models_1.LogError.HandleStatus(res, mail);
    const carpools = await carpoolService.getOldAdressesCarpoolByUser(mail);
    if (carpools instanceof models_1.LogError)
        models_1.LogError.HandleStatus(res, carpools);
    else
        res.json(carpools);
});
//# sourceMappingURL=carpool-router.js.map