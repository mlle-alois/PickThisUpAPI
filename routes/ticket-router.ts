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
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.post("/add", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const ticketService = new TicketServiceImpl(connection);

        const id = await ticketService.getMaxTicketId() + 1;
        const name = req.body.name;
        const description = req.body.description ? req.body.description : null;
        const closingDate = req.body.closingDate ? req.body.closingDate : null;
        const statusId = req.body.statusId;
        const priorityId = req.body.priorityId;

        if (name === undefined || description === undefined ||
            closingDate === undefined || statusId === undefined || priorityId === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const creatorId = await getUserMailConnected(req);
        if (creatorId instanceof LogError)
            return LogError.HandleStatus(res, creatorId);

        const creationDate = DateUtils.getCurrentDate();

        const ticket = await ticketService.createTicket({
            ticketId: id,
            ticketName: name,
            ticketDescription: description,
            ticketCreationDate: creationDate,
            ticketClosingDate: closingDate,
            statusId,
            priorityId,
            creatorId
        })

        if (ticket instanceof LogError) {
            LogError.HandleStatus(res, ticket);
        } else {
            res.status(201);
            res.json(ticket);
        }
    }
    res.status(403).end();
});

/**
 * récupération de tous les tickets
 * URL : /ticket?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
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
});

/**
 * récupération de tickets selon leur statut
 * URL : /ticket/getByStatus
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/getByStatus", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const ticketService = new TicketServiceImpl(connection);

        const status = req.body.status as string;

        if (status === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const tickets = await ticketService.getTicketsByStatus(status);

        res.json(tickets);
    }
    res.status(403).end();
});

/**
 * récupération d'un ticket selon son id
 * URL : /ticket/get/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/get/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
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
});

/**
 * modification d'un ticket selon son id
 * URL : /ticket/update/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/update/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const id = req.params.id;
        const name = req.body.name;
        const description = req.body.description;
        const closingDate = req.body.closingDate;
        const statusId = req.body.statusId;
        const priorityId = req.body.priorityId;

        if (id === undefined || (name === undefined && description === undefined &&
            closingDate === undefined && statusId === undefined && priorityId === undefined)) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }
        const connection = await DatabaseUtils.getConnection();
        const ticketService = new TicketServiceImpl(connection);

        const ticket = await ticketService.updateTicket({
            ticketId: Number.parseInt(id),
            ticketName: name,
            ticketDescription: description,
            ticketClosingDate: closingDate,
            statusId,
            priorityId
        });

        if (ticket instanceof LogError)
            LogError.HandleStatus(res, ticket);
        else
            res.json(ticket);
    }
    res.status(403).end();
});

/**
 * (ré)ouverture d'un ticket selon son id
 * URL : /ticket/open/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/open/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
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
});

/**
 * fermeture d'un ticket selon son id
 * URL : /ticket/close/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/close/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
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
});

/**
 * archivage d'un ticket selon son id
 * URL : /ticket/archive/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/archive/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
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
});

/**
 * suppression d'un ticket selon son id
 * URL : /ticket/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.delete("/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
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
});

/**
 * recherche d'un ticket via mot clé parmi tous les champs des tickets
 * URL : /ticket/search
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/search", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
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
});

/**
 * récupération de tous les status des tickets
 * URL : /ticket/status?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/status", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const statusService = new StatusServiceImpl(connection);

        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

        const status = await statusService.getAllStatus({
            limit,
            offset
        });
        res.json(status);
    }
    res.status(403).end();
});

export {
    ticketRouter
}