import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {
    DateUtils,
    getUserMailConnected,
    isAdministratorConnected,
    isBlockedUserConnected,
    isDevConnected
} from "../Utils";
import {EventServiceImpl} from "../services/impl";
import {LogError} from "../models";
import {ON_ATTEMPT_STATUS, REFUSED_STATUS, VALIDATED_STATUS} from "../consts";

const eventRouter = express.Router();

/**
 * ajout d'un événement
 * URL : /event/add
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
eventRouter.post("/add", authUserMiddleWare, async function (req, res, next) {
    //vérification droits d'accès
    if (!await isBlockedUserConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const eventService = new EventServiceImpl(connection);

        const id = await eventService.getMaxEventId() + 1;
        const title = req.body.title;
        const description = req.body.description;
        const dateHourStart = req.body.dateHourStart; // ex "2021-04-03 18:34:48"
        const dateHourEnd = req.body.dateHourEnd; // ex "2021-04-03 18:34:48"
        const maxNbPlaces = req.body.maxNbPlaces;
        const pictureId = req.body.pictureId;
        const zoneId = req.body.zoneId;

        if (title === undefined || description === undefined || dateHourStart === undefined ||
            dateHourEnd === undefined || maxNbPlaces === undefined || pictureId === undefined ||
            zoneId === undefined) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }

        const dateHourCreation = DateUtils.getCurrentDate();

        const creatorId = await getUserMailConnected(req);
        if (creatorId instanceof LogError)
            return LogError.HandleStatus(res, creatorId);

        const statusId = await isAdministratorConnected(req) ? VALIDATED_STATUS : ON_ATTEMPT_STATUS;

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

        if (event instanceof LogError) {
            LogError.HandleStatus(res, event);
        } else {
            res.status(201);
            res.json(event);
        }
    }
    res.status(403).end();
});

/**
 * récupération de tous les événements disponibles
 * URL : /event?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const eventService = new EventServiceImpl(connection);

    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

    const eventList = await eventService.getAllValidatedEvents({
        limit,
        offset
    });
    res.json(eventList);
});

/**
 * récupération d'un événement selon son id
 * URL : /event/get/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/get/:id", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const eventService = new EventServiceImpl(connection);

    const id = req.params.id;

    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const event = await eventService.getEventById(Number.parseInt(id));

    if (event instanceof LogError)
        LogError.HandleStatus(res, event);
    else
        res.json(event);
});

/**
 * modification d'un événement selon son id
 * URL : /event/update/:id
 * Requete : PUT
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
eventRouter.put("/update/:id", authUserMiddleWare, async function (req, res, next) {
    //vérification droits d'accès
    if (!await isBlockedUserConnected(req)) {
        const id = req.params.id;
        const title = req.body.title;
        const description = req.body.description;
        const dateHourStart = req.body.dateHourStart; // ex "2021-04-03 18:34:48"
        const dateHourEnd = req.body.dateHourEnd; // ex "2021-04-03 18:34:48"
        const maxNbPlaces = req.body.maxNbPlaces;
        const pictureId = req.body.pictureId;

        if (id === undefined || (title === undefined && description === undefined && dateHourStart === undefined &&
            dateHourEnd === undefined && maxNbPlaces === undefined && pictureId === undefined)) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }
        const connection = await DatabaseUtils.getConnection();
        const eventService = new EventServiceImpl(connection);

        const event = await eventService.updateEvent({
            eventId: Number.parseInt(id),
            eventTitle: title,
            eventDescription: description,
            dateHourStart: dateHourStart,
            dateHourEnd: dateHourEnd,
            eventMaxNbPlaces: maxNbPlaces,
            eventPitureId: pictureId
        });

        if (event instanceof LogError)
            LogError.HandleStatus(res, event);
        else
            res.json(event);
    }
    res.status(403).end();
});

/**
 * suppression d'un événement selon son id
 * URL : /event/delete/:id
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
eventRouter.delete("/delete/:id", authUserMiddleWare, async function (req, res, next) {
    if (!await isBlockedUserConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const eventService = new EventServiceImpl(connection);

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
});

/**
 * s'inscrire à un événement selon son id
 * URL : /event/register/:id
 * Requete : POST
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.post("/register/:id", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const eventService = new EventServiceImpl(connection);

    const id = req.params.id;

    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const userMail = await getUserMailConnected(req);
    if (userMail instanceof LogError)
        return LogError.HandleStatus(res, userMail);

    const participants = await eventService.registerEvent(Number.parseInt(id), userMail);

    if (participants instanceof LogError)
        LogError.HandleStatus(res, participants);
    else
        res.json(participants);
});

/**
 * se désinscrire d'un événement selon son id
 * URL : /event/unregister/:id
 * Requete : DELETE
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.delete("/unregister/:id", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const eventService = new EventServiceImpl(connection);

    const id = req.params.id;

    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const userMail = await getUserMailConnected(req);
    if (userMail instanceof LogError)
        return LogError.HandleStatus(res, userMail);

    const participants = await eventService.unregisterEvent(Number.parseInt(id), userMail);

    if (participants instanceof LogError)
        LogError.HandleStatus(res, participants);
    else
        res.json(participants);
});

/**
 * récupérer les événements passés de l'utilisateur connecté
 * URL : /event/getPastEventsByUser
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getPastEventsByUser", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const eventService = new EventServiceImpl(connection);

    const mail = await getUserMailConnected(req);
    if (mail instanceof LogError)
        return LogError.HandleStatus(res, mail);

    const events = await eventService.getPastEventsByUser(mail);

    if (events instanceof LogError)
        LogError.HandleStatus(res, events);
    else
        res.json(events);
});

/**
 * récupérer les événements futurs de l'utilisateur connecté
 * URL : /event/getFutureEventsByUser
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getFutureEventsByUser", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const eventService = new EventServiceImpl(connection);

    const mail = await getUserMailConnected(req);
    if (mail instanceof LogError)
        return LogError.HandleStatus(res, mail);

    const events = await eventService.getFutureEventsByUser(mail);

    if (events instanceof LogError)
        LogError.HandleStatus(res, events);
    else
        res.json(events);
});

/**
 * récupérer les événements en cours de l'utilisateur connecté
 * URL : /event/getActualEventsByUser
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getActualEventsByUser", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const eventService = new EventServiceImpl(connection);

    const mail = await getUserMailConnected(req);
    if (mail instanceof LogError)
        return LogError.HandleStatus(res, mail);

    const events = await eventService.getActualEventsByUser(mail);

    if (events instanceof LogError)
        LogError.HandleStatus(res, events);
    else
        res.json(events);
});

/**
 * accepter un événement selon son id
 * URL : /event/accept/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
eventRouter.put("/accept/:id", authUserMiddleWare, async function (req, res, next) {
    if (await isAdministratorConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const eventService = new EventServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const event = await eventService.acceptEvent(Number.parseInt(id));

        if (event instanceof LogError)
            LogError.HandleStatus(res, event);
        else
            res.json(event);
    }
    res.status(403).end();
});

/**
 * refuser un événement selon son id
 * URL : /event/refuse/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
eventRouter.put("/refuse/:id", authUserMiddleWare, async function (req, res, next) {
    if (await isAdministratorConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const eventService = new EventServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const event = await eventService.refuseEvent(Number.parseInt(id));

        if (event instanceof LogError)
            LogError.HandleStatus(res, event);
        else
            res.json(event);
    }
    res.status(403).end();
});

/**
 * récupérer tous les participants d'un événement selon son id
 * URL : /event/getParticipants/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getParticipants/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await DatabaseUtils.getConnection();
        const eventService = new EventServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const participants = await eventService.getParticipantsEvent(Number.parseInt(id));

        if (participants instanceof LogError)
            LogError.HandleStatus(res, participants);
        else
            res.json(participants);
    } catch (err) {
        next(err);
    }
});

export {
    eventRouter
}