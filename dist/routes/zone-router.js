"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoneRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const Utils_1 = require("../Utils");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const consts_1 = require("../consts");
const zoneRouter = express_1.default.Router();
exports.zoneRouter = zoneRouter;
zoneRouter.post("/add", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
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
            const signalmanId = await (0, Utils_1.getUserMailConnected)(req);
            if (signalmanId instanceof models_1.LogError)
                return models_1.LogError.HandleStatus(res, signalmanId);
            const statusId = await (0, Utils_1.isAdministratorConnected)(req) ? consts_1.VALIDATED_STATUS : consts_1.ON_ATTEMPT_STATUS;
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
            if (zone instanceof models_1.LogError) {
                models_1.LogError.HandleStatus(res, zone);
            }
            else {
                res.json(zone);
                res.status(201).end();
            }
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.get("/", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const zoneService = new impl_1.ZoneServiceImpl(connection);
        const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
        const userMail = await (0, Utils_1.getUserMailConnected)(req);
        if (userMail instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, userMail);
        const zoneList = await zoneService.getAllAvailableZones(userMail, {
            limit,
            offset
        });
        res.json(zoneList);
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const zoneService = new impl_1.ZoneServiceImpl(connection);
        const id = req.params.id;
        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const zone = await zoneService.getZoneById(Number.parseInt(id));
        if (zone instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, zone);
        else
            res.json(zone);
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
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
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
            const zone = await zoneService.updateZone({
                zoneId: Number.parseInt(id),
                zoneStreet: street,
                zoneZipcode: zipcode,
                zoneCity: city,
                zoneDescription: description,
                pollutionLevelId: pollutionLevelId
            });
            if (zone instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, zone);
            else
                res.json(zone);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
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
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.get("/my-zones-by-status/:status", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const zoneService = new impl_1.ZoneServiceImpl(connection);
        const statusId = req.params.status;
        if (statusId === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const mail = await (0, Utils_1.getUserMailConnected)(req);
        if (mail instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, mail);
        const zones = await zoneService.getZonesByUserAndStatus(mail, Number.parseInt(statusId));
        if (zones instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, zones);
        else
            res.json(zones);
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.get("/my-zones", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const zoneService = new impl_1.ZoneServiceImpl(connection);
        const mail = await (0, Utils_1.getUserMailConnected)(req);
        if (mail instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, mail);
        const zones = await zoneService.getZonesByUser(mail);
        if (zones instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, zones);
        else
            res.json(zones);
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.get("/getValidatedZones", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
            const zones = await zoneService.getValidatedZones();
            if (zones instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, zones);
            else
                res.json(zones);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.get("/getWaitingZones", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
            const zones = await zoneService.getWaitingZones();
            if (zones instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, zones);
            else
                res.json(zones);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.get("/getRefusedZones", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
            const zones = await zoneService.getRefusedZones();
            if (zones instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, zones);
            else
                res.json(zones);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.put("/accept/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const zone = await zoneService.acceptZone(Number.parseInt(id));
            if (zone instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, zone);
            else
                res.json(zone);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.put("/refuse/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const zone = await zoneService.refuseZone(Number.parseInt(id));
            if (zone instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, zone);
            else
                res.json(zone);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.post("/add-picture", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
            const mediaService = new impl_1.MediaServiceImpl(connection);
            const zoneId = req.body.zoneId;
            const path = req.body.path;
            if (path === undefined || zoneId === undefined) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const media = await zoneService.addMediaToZone({
                mediaId: 0,
                mediaPath: path
            }, Number.parseInt(zoneId));
            if (media instanceof models_1.LogError) {
                models_1.LogError.HandleStatus(res, media);
            }
            else {
                res.status(201);
                res.json(media);
            }
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.delete("/delete-picture", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (!await (0, Utils_1.isBlockedUserConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const zoneService = new impl_1.ZoneServiceImpl(connection);
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
    }
    catch (err) {
        next(err);
    }
});
zoneRouter.get("/get-pictures/:zoneId", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const zoneService = new impl_1.ZoneServiceImpl(connection);
        const zoneId = req.params.zoneId;
        if (zoneId === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const pictures = await zoneService.getMediaZonesById(Number.parseInt(zoneId));
        if (pictures instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, pictures);
        else
            res.json(pictures);
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=zone-router.js.map