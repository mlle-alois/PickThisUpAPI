"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const Utils_1 = require("../Utils");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const ticketRouter = express_1.default.Router();
exports.ticketRouter = ticketRouter;
ticketRouter.post("/add", async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const ticketService = new impl_1.TicketServiceImpl(connection);
        const id = await ticketService.getMaxTicketId() + 1;
        const name = req.body.name;
        const description = req.body.description ? req.body.description : null;
        const closingDate = req.body.closingDate ? req.body.closingDate : null;
        const statusId = req.body.statusId ? req.body.statusId : 1;
        const priorityId = req.body.priorityId ? req.body.priorityId : 1;
        const creator = (req.body.creator && req.body.creator !== "") ? req.body.creator : "no_user";
        if (name === undefined || description === undefined ||
            closingDate === undefined || statusId === undefined || priorityId === undefined || creator === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const creationDate = Utils_1.DateUtils.getCurrentDate();
        const ticket = await ticketService.createTicket({
            ticketId: id,
            ticketName: name,
            ticketDescription: description,
            ticketCreationDate: creationDate,
            ticketClosingDate: closingDate,
            statusId,
            priorityId,
            creatorId: creator
        });
        if (ticket instanceof models_1.LogError) {
            models_1.LogError.HandleStatus(res, ticket);
        }
        else {
            res.status(201);
            res.json(ticket);
        }
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.get("/", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
            const tickets = await ticketService.getAllTickets({
                limit,
                offset
            });
            res.json(tickets);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.get("/getByStatus", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const status = req.query.status;
            if (status === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const tickets = await ticketService.getTicketsByStatus(status);
            res.json(tickets);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const ticket = await ticketService.getTicketById(Number.parseInt(id));
            if (ticket instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.get("/getMembers/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const members = await ticketService.getMembersByTicketId(Number.parseInt(id));
            res.json(members);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            const name = req.body.name;
            const description = req.body.description;
            const priorityId = req.body.priorityId;
            if (id === undefined || (name === undefined && description === undefined && priorityId === undefined)) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const ticket = await ticketService.updateTicket({
                ticketId: Number.parseInt(id),
                ticketName: name,
                ticketDescription: description,
                priorityId
            });
            if (ticket instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.put("/open/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const ticket = await ticketService.openTicket(Number.parseInt(id));
            if (ticket instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.put("/close/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const ticket = await ticketService.closeTicket(Number.parseInt(id));
            if (ticket instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.put("/archive/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const ticket = await ticketService.archiveTicket(Number.parseInt(id));
            if (ticket instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const success = await ticketService.deleteTicketById(Number.parseInt(id));
            if (success)
                res.status(204).end();
            else
                res.status(404).end();
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.get("/search", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const search = req.body.search;
            if (search === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const tickets = await ticketService.searchTickets(search);
            if (tickets instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, tickets);
            else
                res.json(tickets);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.post("/assign", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const ticketId = req.body.ticketId;
            const userMail = req.body.userMail;
            if (ticketId === undefined || userMail === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const assignation = await ticketService.assignUserToTicket(Number.parseInt(ticketId), userMail);
            if (assignation instanceof models_1.LogError) {
                models_1.LogError.HandleStatus(res, assignation);
            }
            else {
                res.status(201);
                res.json(assignation);
            }
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
ticketRouter.delete("/unassign", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const ticketService = new impl_1.TicketServiceImpl(connection);
            const ticketId = req.query.ticketId;
            const userMail = req.query.userMail;
            if (ticketId === undefined || userMail === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const success = await ticketService.unassignUserToTicket(Number.parseInt(ticketId), userMail);
            if (success)
                res.status(204).end();
            else
                res.status(404).end();
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=ticket-router.js.map