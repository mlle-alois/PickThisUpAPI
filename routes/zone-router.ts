import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {getUserMailConnected, isAdministratorConnected, isBlockedUserConnected, isDevConnected} from "../Utils";
import {ZoneServiceImpl} from "../services/impl";
import {LogError} from "../models";
import {ON_ATTEMPT_STATUS, VALIDATED_STATUS} from "../consts";
import {MediaServiceImpl} from "../services/impl";

const zoneRouter = express.Router();

/**
 * ajout d'une zone
 * URL : /zone/add
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.post("/add", authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await isBlockedUserConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const zoneService = new ZoneServiceImpl(connection);

            const id = await zoneService.getMaxZoneId() + 1;
            const street = req.body.street;
            const zipcode = req.body.zipcode;
            const city = req.body.city;
            const description = req.body.description;
            const pollutionLevel = req.body.pollutionLevel;

            if (street === undefined || zipcode === undefined || city === undefined || description === undefined || pollutionLevel === undefined) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }

            const signalmanId = await getUserMailConnected(req);
            if (signalmanId instanceof LogError)
                return LogError.HandleStatus(res, signalmanId);

            const statusId = await isAdministratorConnected(req) ? VALIDATED_STATUS : ON_ATTEMPT_STATUS;

            const zone = await zoneService.createZone({
                zoneId: id,
                zoneStreet: street,
                zoneZipcode: zipcode,
                zoneCity: city,
                zoneDescription: description,
                signalmanId: signalmanId,
                statusId: statusId,
                pollutionLevelId: pollutionLevel
            });

            if (zone instanceof LogError) {
                LogError.HandleStatus(res, zone);
            } else {
                res.json(zone);
                res.status(201).end();
            }
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupération de toutes les zones disponibles
 * URL : /zone?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/", authUserMiddleWare, async function (req, res, next) {
    try {
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
    } catch (err) {
        next(err);
    }
});

/**
 * récupération d'une zone selon son id
 * URL : /zone/get/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/get/:id", authUserMiddleWare, async function (req, res, next) {
    try {
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
    } catch (err) {
        next(err);
    }
});

/**
 * modification d'une zone selon son id
 * URL : /zone/update/:id
 * Requete : PUT
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/update/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await isBlockedUserConnected(req)) {
            const id = req.params.id;
            const street = req.body.street;
            const zipcode = req.body.zipcode;
            const city = req.body.city;
            const description = req.body.description;
            const pollutionLevelId = req.body.pollutionLevel;

            if (id === undefined || (street === undefined && zipcode === undefined && city === undefined && description === undefined && pollutionLevelId === undefined)) {
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
                zoneDescription: description,
                pollutionLevelId: pollutionLevelId
            });

            if (zone instanceof LogError)
                LogError.HandleStatus(res, zone);
            else
                res.json(zone);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * suppression d'une zone selon son id
 * URL : /zone/delete/:id
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.delete("/delete/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await isBlockedUserConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const zoneService = new ZoneServiceImpl(connection);

            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const success = await zoneService.deleteZoneById(Number.parseInt(id));

            if (success)
                res.json(success);
            else
                res.status(404).end();
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupérer les zones de l'utilisateur connecté selon leur statut
 * URL : /zone/my-zones-by-status/:status
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/my-zones-by-status/:status", authUserMiddleWare, async function (req, res, next) {
    try {
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
    } catch (err) {
        next(err);
    }
});

/**
 * récupérer les zones de l'utilisateur connecté
 * URL : /zone/my-zones
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/my-zones", authUserMiddleWare, async function (req, res, next) {
    try {
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
    } catch (err) {
        next(err);
    }
});

/**
 * récupérer les zones validées
 * URL : /zone/getValidatedZones
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/getValidatedZones", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isAdministratorConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const zoneService = new ZoneServiceImpl(connection);

            const zones = await zoneService.getValidatedZones();

            if (zones instanceof LogError)
                LogError.HandleStatus(res, zones);
            else
                res.json(zones);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupérer les zones en attente
 * URL : /zone/getWaitingZones
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/getWaitingZones", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isAdministratorConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const zoneService = new ZoneServiceImpl(connection);

            const zones = await zoneService.getWaitingZones();

            if (zones instanceof LogError)
                LogError.HandleStatus(res, zones);
            else
                res.json(zones);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupérer les zones refusées
 * URL : /zone/getRefusedZones
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/getRefusedZones", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isAdministratorConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const zoneService = new ZoneServiceImpl(connection);

            const zones = await zoneService.getRefusedZones();

            if (zones instanceof LogError)
                LogError.HandleStatus(res, zones);
            else
                res.json(zones);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * accepter une zone selon son id
 * URL : /zone/accept/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/accept/:id", authUserMiddleWare, async function (req, res, next) {
    try {
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
    } catch (err) {
        next(err);
    }
});

/**
 * refuser une zone selon son id
 * URL : /zone/refuse/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/refuse/:id", authUserMiddleWare, async function (req, res, next) {
    try {
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
    } catch (err) {
        next(err);
    }
});

/**
 * ajout d'une image dans une zone
 * URL : /zone/add-picture
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.post("/add-picture", authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await isBlockedUserConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const zoneService = new ZoneServiceImpl(connection);
            const mediaService = new MediaServiceImpl(connection);

            const zoneId = req.body.zoneId;
            const path = req.body.path;

            if (path === undefined || zoneId === undefined) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }

            const media = await zoneService.addMediaToZone({
                mediaId: 0,
                mediaPath: path
            }, Number.parseInt(zoneId as string));

            if (media instanceof LogError) {
                LogError.HandleStatus(res, media);
            } else {
                res.status(201);
                res.json(media);
            }
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * suppression d'une image dans une zone
 * URL : /zone/delete-picture
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.delete("/delete-picture", authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await isBlockedUserConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const zoneService = new ZoneServiceImpl(connection);

            const mediaId = req.body.mediaId;
            const zoneId = req.body.zoneId;

            if (mediaId === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const success = await zoneService.removeMediaToZone(Number.parseInt(mediaId), Number.parseInt(zoneId));

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
 * récupération les images d'une zone selon son id
 * URL : /zone/get-pictures/:zoneId
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/get-pictures/:zoneId", authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await DatabaseUtils.getConnection();
        const zoneService = new ZoneServiceImpl(connection);

        const zoneId = req.params.zoneId;

        if (zoneId === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const pictures = await zoneService.getMediaZonesById(Number.parseInt(zoneId));

        if (pictures instanceof LogError)
            LogError.HandleStatus(res, pictures);
        else
            res.json(pictures);
    } catch (err) {
        next(err);
    }
});

export {
    zoneRouter
}