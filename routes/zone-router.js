"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoneRouter = void 0;
var express_1 = __importDefault(require("express"));
var database_1 = require("../database/database");
var auth_middleware_1 = require("../middlewares/auth-middleware");
var Utils_1 = require("../Utils");
var impl_1 = require("../services/impl");
var models_1 = require("../models");
var consts_1 = require("../consts");
var zoneRouter = express_1.default.Router();
exports.zoneRouter = zoneRouter;
/**
 * ajout d'une zone
 * URL : /zone/add
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.post("/add", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, id, street, zipcode, city, description, pollutionLevel, signalmanId, statusId, zone, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 7];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    return [4 /*yield*/, zoneService.getMaxZoneId()];
                case 3:
                    id = (_a.sent()) + 1;
                    street = req.body.street;
                    zipcode = req.body.zipcode;
                    city = req.body.city;
                    description = req.body.description;
                    pollutionLevel = req.body.pollutionLevel;
                    if (street === undefined || zipcode === undefined || city === undefined || description === undefined || pollutionLevel === undefined) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 4:
                    signalmanId = _a.sent();
                    if (signalmanId instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, signalmanId)];
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 5:
                    statusId = (_a.sent()) ? consts_1.VALIDATED_STATUS : consts_1.ON_ATTEMPT_STATUS;
                    return [4 /*yield*/, zoneService.createZone({
                            zoneId: id,
                            zoneStreet: street,
                            zoneZipcode: zipcode,
                            zoneCity: city,
                            zoneDescription: description,
                            signalmanId: signalmanId,
                            statusId: statusId,
                            pollutionLevelId: pollutionLevel
                        })];
                case 6:
                    zone = _a.sent();
                    if (zone instanceof models_1.LogError) {
                        models_1.LogError.HandleStatus(res, zone);
                    }
                    else {
                        res.json(zone);
                        res.status(201).end();
                    }
                    _a.label = 7;
                case 7:
                    res.status(403).end();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération de toutes les zones disponibles
 * URL : /zone?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, limit, offset, userMail, zoneList, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    userMail = _a.sent();
                    if (userMail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, userMail)];
                    return [4 /*yield*/, zoneService.getAllAvailableZones(userMail, {
                            limit: limit,
                            offset: offset
                        })];
                case 3:
                    zoneList = _a.sent();
                    res.json(zoneList);
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    next(err_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération d'une zone selon son id
 * URL : /zone/get/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, id, zone, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, zoneService.getZoneById(Number.parseInt(id))];
                case 2:
                    zone = _a.sent();
                    if (zone instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zone);
                    else
                        res.json(zone);
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    next(err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
/**
 * modification d'une zone selon son id
 * URL : /zone/update/:id
 * Requete : PUT
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, street, zipcode, city, description, pollutionLevelId, connection, zoneService, zone, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    id = req.params.id;
                    street = req.body.street;
                    zipcode = req.body.zipcode;
                    city = req.body.city;
                    description = req.body.description;
                    pollutionLevelId = req.body.pollutionLevel;
                    if (id === undefined || (street === undefined && zipcode === undefined && city === undefined && description === undefined && pollutionLevelId === undefined)) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    return [4 /*yield*/, zoneService.updateZone({
                            zoneId: Number.parseInt(id),
                            zoneStreet: street,
                            zoneZipcode: zipcode,
                            zoneCity: city,
                            zoneDescription: description,
                            pollutionLevelId: pollutionLevelId
                        })];
                case 3:
                    zone = _a.sent();
                    if (zone instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zone);
                    else
                        res.json(zone);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_4 = _a.sent();
                    next(err_4);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * suppression d'une zone selon son id
 * URL : /zone/delete/:id
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, id, success, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, zoneService.deleteZoneById(Number.parseInt(id))];
                case 3:
                    success = _a.sent();
                    if (success)
                        res.json(success);
                    else
                        res.status(404).end();
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_5 = _a.sent();
                    next(err_5);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les zones de l'utilisateur connecté selon leur statut
 * URL : /zone/my-zones-by-status/:status
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/my-zones-by-status/:status", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, statusId, mail, zones, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    statusId = req.params.status;
                    if (statusId === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    mail = _a.sent();
                    if (mail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, mail)];
                    return [4 /*yield*/, zoneService.getZonesByUserAndStatus(mail, Number.parseInt(statusId))];
                case 3:
                    zones = _a.sent();
                    if (zones instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zones);
                    else
                        res.json(zones);
                    return [3 /*break*/, 5];
                case 4:
                    err_6 = _a.sent();
                    next(err_6);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les zones de l'utilisateur connecté
 * URL : /zone/my-zones
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/my-zones", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, mail, zones, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    mail = _a.sent();
                    if (mail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, mail)];
                    return [4 /*yield*/, zoneService.getZonesByUser(mail)];
                case 3:
                    zones = _a.sent();
                    if (zones instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zones);
                    else
                        res.json(zones);
                    return [3 /*break*/, 5];
                case 4:
                    err_7 = _a.sent();
                    next(err_7);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les zones validées
 * URL : /zone/getValidatedZones
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/getValidatedZones", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, zones, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    return [4 /*yield*/, zoneService.getValidatedZones()];
                case 3:
                    zones = _a.sent();
                    if (zones instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zones);
                    else
                        res.json(zones);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_8 = _a.sent();
                    next(err_8);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les zones en attente
 * URL : /zone/getWaitingZones
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/getWaitingZones", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, zones, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    return [4 /*yield*/, zoneService.getWaitingZones()];
                case 3:
                    zones = _a.sent();
                    if (zones instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zones);
                    else
                        res.json(zones);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_9 = _a.sent();
                    next(err_9);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les zones refusées
 * URL : /zone/getRefusedZones
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/getRefusedZones", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, zones, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    return [4 /*yield*/, zoneService.getRefusedZones()];
                case 3:
                    zones = _a.sent();
                    if (zones instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zones);
                    else
                        res.json(zones);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_10 = _a.sent();
                    next(err_10);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * accepter une zone selon son id
 * URL : /zone/accept/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/accept/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, id, zone, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, zoneService.acceptZone(Number.parseInt(id))];
                case 3:
                    zone = _a.sent();
                    if (zone instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zone);
                    else
                        res.json(zone);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_11 = _a.sent();
                    next(err_11);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * refuser une zone selon son id
 * URL : /zone/refuse/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
zoneRouter.put("/refuse/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, id, zone, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, zoneService.refuseZone(Number.parseInt(id))];
                case 3:
                    zone = _a.sent();
                    if (zone instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, zone);
                    else
                        res.json(zone);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_12 = _a.sent();
                    next(err_12);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * ajout d'une image dans une zone
 * URL : /zone/add-picture
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.post("/add-picture", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, mediaService, zoneId, path, media, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    mediaService = new impl_1.MediaServiceImpl(connection);
                    zoneId = req.body.zoneId;
                    path = req.body.path;
                    if (path === undefined || zoneId === undefined) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, zoneService.addMediaToZone({
                            mediaId: 0,
                            mediaPath: path
                        }, Number.parseInt(zoneId))];
                case 3:
                    media = _a.sent();
                    if (media instanceof models_1.LogError) {
                        models_1.LogError.HandleStatus(res, media);
                    }
                    else {
                        res.status(201);
                        res.json(media);
                    }
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_13 = _a.sent();
                    next(err_13);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * suppression d'une image dans une zone
 * URL : /zone/delete-picture
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
zoneRouter.delete("/delete-picture", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, mediaId, zoneId, success, err_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    mediaId = req.body.mediaId;
                    zoneId = req.body.zoneId;
                    if (mediaId === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, zoneService.removeMediaToZone(Number.parseInt(mediaId), Number.parseInt(zoneId))];
                case 3:
                    success = _a.sent();
                    if (success)
                        res.status(204).end();
                    else
                        res.status(404).end();
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_14 = _a.sent();
                    next(err_14);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération les images d'une zone selon son id
 * URL : /zone/get-pictures/:zoneId
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
zoneRouter.get("/get-pictures/:zoneId", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, zoneService, zoneId, pictures, err_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    zoneService = new impl_1.ZoneServiceImpl(connection);
                    zoneId = req.params.zoneId;
                    if (zoneId === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, zoneService.getMediaZonesById(Number.parseInt(zoneId))];
                case 2:
                    pictures = _a.sent();
                    if (pictures instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, pictures);
                    else
                        res.json(pictures);
                    return [3 /*break*/, 4];
                case 3:
                    err_15 = _a.sent();
                    next(err_15);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
