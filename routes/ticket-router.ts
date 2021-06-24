import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {DateUtils, getUserMailConnected, isDevConnected} from "../Utils";
import {StatusServiceImpl, TicketServiceImpl} from "../services/impl";
import {LogError} from "../models";


const ticketRouter = express.Router();

/**
 * ajout d'un ticket
 * URL : /ticket/add
 * Requete : POST
 * ACCES : TOUT LE MONDe
 * Nécessite d'être connecté : NON
 */
ticketRouter.post("/add", async function (req, res, next) {
    try {
        const connection = await DatabaseUtils.getConnection();
        const ticketService = new TicketServiceImpl(connection);

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

        const creationDate = DateUtils.getCurrentDate();

        const ticket = await ticketService.createTicket({
            ticketId: id,
            ticketName: name,
            ticketDescription: description,
            ticketCreationDate: creationDate,
            ticketClosingDate: closingDate,
            statusId,
            priorityId,
            creatorId: creator
        })

        if (ticket instanceof LogError) {
            LogError.HandleStatus(res, ticket);
        } else {
            res.status(201);
            res.json(ticket);
        }
    } catch (err) {
        next(err);
    }
});

/**
 * récupération de tous les tickets
 * URL : /ticket?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

            const tickets = await ticketService.getAllTickets({
                limit,
                offset
            });
            res.json(tickets);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupération de tickets selon leur statut
 * URL : /ticket/getByStatus?status={x}
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/getByStatus", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const status = req.query.status as string;

            if (status === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const tickets = await ticketService.getTicketsByStatus(status);

            res.json(tickets);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupération d'un ticket selon son id
 * URL : /ticket/get/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/get/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const ticket = await ticketService.getTicketById(Number.parseInt(id));
            if (ticket instanceof LogError)
                LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupération des membres d'un ticket
 * URL : /ticket/getMembers/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/getMembers/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const members = await ticketService.getMembersByTicketId(Number.parseInt(id));

            res.json(members);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * modification d'un ticket selon son id
 * URL : /ticket/update/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/update/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const id = req.params.id;
            const name = req.body.name;
            const description = req.body.description;
            const priorityId = req.body.priorityId;

            if (id === undefined || (name === undefined && description === undefined && priorityId === undefined)) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const ticket = await ticketService.updateTicket({
                ticketId: Number.parseInt(id),
                ticketName: name,
                ticketDescription: description,
                priorityId
            });

            if (ticket instanceof LogError)
                LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * (ré)ouverture d'un ticket selon son id
 * URL : /ticket/open/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/open/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const ticket = await ticketService.openTicket(Number.parseInt(id));

            if (ticket instanceof LogError)
                LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * fermeture d'un ticket selon son id
 * URL : /ticket/close/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/close/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const ticket = await ticketService.closeTicket(Number.parseInt(id));

            if (ticket instanceof LogError)
                LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * archivage d'un ticket selon son id
 * URL : /ticket/archive/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/archive/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const ticket = await ticketService.archiveTicket(Number.parseInt(id));

            if (ticket instanceof LogError)
                LogError.HandleStatus(res, ticket);
            else
                res.json(ticket);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * suppression d'un ticket selon son id
 * URL : /ticket/delete/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.delete("/delete/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

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
    } catch (err) {
        next(err);
    }
});

/**
 * recherche d'un ticket via mot clé parmi tous les champs des tickets
 * URL : /ticket/search
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/search", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const search = req.body.search;

            if (search === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const tickets = await ticketService.searchTickets(search);
            if (tickets instanceof LogError)
                LogError.HandleStatus(res, tickets);
            else
                res.json(tickets);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});


/**
 * assignation d'un développeur à un ticket
 * URL : /ticket/assign?ticketId={x}&userMail={x}
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.post("/assign", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const ticketId = req.body.ticketId as string;
            const userMail = req.body.userMail as string;

            if (ticketId === undefined || userMail === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const assignation = await ticketService.assignUserToTicket(Number.parseInt(ticketId), userMail);

            if (assignation instanceof LogError) {
                LogError.HandleStatus(res, assignation);
            } else {
                res.status(201);
                res.json(assignation);
            }
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * désassignation d'un développeur à un ticket
 * URL : /ticket/unassign?ticketId={x}&userMail={x}
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.delete("/unassign", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const ticketService = new TicketServiceImpl(connection);

            const ticketId = req.query.ticketId as string;
            const userMail = req.query.userMail as string;

            if (ticketId === undefined || userMail === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const success = await ticketService.unassignUserToTicket(Number.parseInt(ticketId), userMail);
            if (success)
                res.status(204).end();
            else
                res.status(404).end();
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

export {
    ticketRouter
}