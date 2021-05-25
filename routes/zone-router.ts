import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {
    getUserMailConnected,
    isAdministratorConnected,
    isBlockedUserConnected,
    isDevConnected
} from "../Utils";
import {ZoneServiceImpl} from "../services/impl";
import {LogError} from "../models";
import {REFUSED_STATUS, VALIDATED_STATUS} from "../consts";

const zoneRouter = express.Router();

/**
 * ajout d'une zone
 * URL : /zone/add
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.post("/add", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (!await isBlockedUserConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const zoneService = new ZoneServiceImpl(connection);

        const id = await zoneService.getMaxZoneId() + 1;
        const street = req.body.street;
        const zipcode = req.body.zipcode;
        const city = req.body.city;
        const description = req.body.description;

        if (street === undefined || zipcode === undefined || city === undefined || description === undefined) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }

        const signalmanId = await getUserMailConnected(req);
        if (signalmanId instanceof LogError)
            return LogError.HandleStatus(res, signalmanId);

        const statusId = await isAdministratorConnected(req) ? VALIDATED_STATUS : REFUSED_STATUS;

        const zone = await zoneService.createZone({
            zoneId: id,
            zoneStreet: street,
            zoneZipcode: zipcode,
            zoneCity: city,
            zoneDescription: description,
            signalmanId: signalmanId,
            statusId: statusId
        });

        if (zone instanceof LogError) {
            LogError.HandleStatus(res, zone);
        } else {
            res.status(201);
            res.json(zone);
        }
    }
    res.status(403).end();
});

/**
 * récupération de toutes les zones disponibles
 * URL : /zone?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/", authUserMiddleWare, async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const zoneService = new ZoneServiceImpl(connection);

    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

    const userMail = await getUserMailConnected(req);
    if (userMail instanceof LogError)
        return LogError.HandleStatus(res, userMail);

    const zoneList = await zoneService.getAllAvailableZones(userMail, {
        limit,
        offset
    });
    res.json(zoneList);
});

/**
 * récupération d'une zone selon son id
 * URL : /zone/get/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/get/:id", authUserMiddleWare, async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const zoneService = new ZoneServiceImpl(connection);

    const id = req.params.id;

    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const zone = await zoneService.getZoneById(Number.parseInt(id));

    if (zone instanceof LogError)
        LogError.HandleStatus(res, zone);
    else
        res.json(zone);
});

/**
 * modification d'une zone selon son id
 * URL : /zone/update/:id
 * Requete : PUT
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/update/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (!await isBlockedUserConnected(req)) {
        const id = req.params.id;
        const street = req.body.street;
        const zipcode = req.body.zipcode;
        const city = req.body.city;
        const description = req.body.description;

        if (id === undefined || (street === undefined && zipcode === undefined && city === undefined && description === undefined)) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }
        const connection = await DatabaseUtils.getConnection();
        const zoneService = new ZoneServiceImpl(connection);

        const zone = await zoneService.updateZone({
            zoneId: Number.parseInt(id),
            zoneStreet: street,
            zoneZipcode: zipcode,
            zoneCity: city,
            zoneDescription: description
        });

        if (zone instanceof LogError)
            LogError.HandleStatus(res, zone);
        else
            res.json(zone);
    }
    res.status(403).end();
});

/**
 * suppression d'une zone selon son id
 * URL : /zone/delete/:id
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.delete("/delete/:id", authUserMiddleWare, async function (req, res) {
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const zoneService = new ZoneServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const success = await zoneService.deleteZonesById(Number.parseInt(id));

        if (success)
            res.status(204).end();
        else
            res.status(404).end();
    }
    res.status(403).end();
});

/**
 * récupérer les zones de l'utilisateur connecté selon leur statut
 * URL : /zone/my-zones-by-status/:status
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/my-zones-by-status/:status", authUserMiddleWare, async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const zoneService = new ZoneServiceImpl(connection);

    const statusId = req.params.status;

    if (statusId === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const mail = await getUserMailConnected(req);
    if (mail instanceof LogError)
        return LogError.HandleStatus(res, mail);

    const zones = await zoneService.getZonesByUserAndStatus(mail, Number.parseInt(statusId));

    if (zones instanceof LogError)
        LogError.HandleStatus(res, zones);
    else
        res.json(zones);
});

/**
 * récupérer les zones de l'utilisateur connecté
 * URL : /zone/my-zones
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/my-zones", authUserMiddleWare, async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const zoneService = new ZoneServiceImpl(connection);

    const mail = await getUserMailConnected(req);
    if (mail instanceof LogError)
        return LogError.HandleStatus(res, mail);

    const zones = await zoneService.getZonesByUser(mail);

    if (zones instanceof LogError)
        LogError.HandleStatus(res, zones);
    else
        res.json(zones);
});

/**
 * accepter une zone selon son id
 * URL : /zone/accept/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/accept/:id", authUserMiddleWare, async function (req, res) {
    if (await isAdministratorConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const zoneService = new ZoneServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const zone = await zoneService.acceptZone(Number.parseInt(id));

        if (zone instanceof LogError)
            LogError.HandleStatus(res, zone);
        else
            res.json(zone);
    }
    res.status(403).end();
});

/**
 * refuser une zone selon son id
 * URL : /zone/refuse/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/refuse/:id", authUserMiddleWare, async function (req, res) {
    if (await isAdministratorConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const zoneService = new ZoneServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const zone = await zoneService.refuseZone(Number.parseInt(id));

        if (zone instanceof LogError)
            LogError.HandleStatus(res, zone);
        else
            res.json(zone);
    }
    res.status(403).end();
});

export {
    zoneRouter
}