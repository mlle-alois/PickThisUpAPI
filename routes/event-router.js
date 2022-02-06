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
exports.eventRouter = void 0;
var express_1 = __importDefault(require("express"));
var database_1 = require("../database/database");
var auth_middleware_1 = require("../middlewares/auth-middleware");
var Utils_1 = require("../Utils");
var impl_1 = require("../services/impl");
var models_1 = require("../models");
var consts_1 = require("../consts");
var eventRouter = express_1.default.Router();
exports.eventRouter = eventRouter;
/**
 * ajout d'un événement
 * URL : /event/add
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
eventRouter.post("/add", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, id, title, description, dateHourStart, dateHourEnd, maxNbPlaces, pictureId, zoneId, dateHourCreation, creatorId, statusId, event_1, err_1;
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
                    eventService = new impl_1.EventServiceImpl(connection);
                    return [4 /*yield*/, eventService.getMaxEventId()];
                case 3:
                    id = (_a.sent()) + 1;
                    title = req.body.title;
                    description = req.body.description;
                    dateHourStart = req.body.dateHourStart;
                    dateHourEnd = req.body.dateHourEnd;
                    maxNbPlaces = req.body.maxNbPlaces;
                    pictureId = req.body.pictureId;
                    zoneId = req.body.zoneId;
                    if (title === undefined || description === undefined || dateHourStart === undefined ||
                        dateHourEnd === undefined || maxNbPlaces === undefined || pictureId === undefined ||
                        zoneId === undefined) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    dateHourCreation = Utils_1.DateUtils.getCurrentDate();
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 4:
                    creatorId = _a.sent();
                    if (creatorId instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, creatorId)];
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 5:
                    statusId = (_a.sent()) ? consts_1.VALIDATED_STATUS : consts_1.ON_ATTEMPT_STATUS;
                    return [4 /*yield*/, eventService.createEvent({
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
                        })];
                case 6:
                    event_1 = _a.sent();
                    if (event_1 instanceof models_1.LogError) {
                        models_1.LogError.HandleStatus(res, event_1);
                    }
                    else {
                        res.status(201);
                        res.json(event_1);
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
 * récupération de tous les événements disponibles
 * URL : /event?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, limit, offset, eventList, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    return [4 /*yield*/, eventService.getAllValidatedEvents({
                            limit: limit,
                            offset: offset
                        })];
                case 2:
                    eventList = _a.sent();
                    res.json(eventList);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    next(err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération d'un événement selon son id
 * URL : /event/get/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, id, event_2, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, eventService.getEventById(Number.parseInt(id))];
                case 2:
                    event_2 = _a.sent();
                    if (event_2 instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, event_2);
                    else
                        res.json(event_2);
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
 * modification d'un événement selon son id
 * URL : /event/update/:id
 * Requete : PUT
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
eventRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, title, description, dateHourStart, dateHourEnd, maxNbPlaces, pictureId, connection, eventService, event_3, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    id = req.params.id;
                    title = req.body.title;
                    description = req.body.description;
                    dateHourStart = req.body.dateHourStart;
                    dateHourEnd = req.body.dateHourEnd;
                    maxNbPlaces = req.body.maxNbPlaces;
                    pictureId = req.body.pictureId;
                    if (id === undefined || (title === undefined && description === undefined && dateHourStart === undefined &&
                        dateHourEnd === undefined && maxNbPlaces === undefined && pictureId === undefined)) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    return [4 /*yield*/, eventService.updateEvent({
                            eventId: Number.parseInt(id),
                            eventTitle: title,
                            eventDescription: description,
                            dateHourStart: dateHourStart,
                            dateHourEnd: dateHourEnd,
                            eventMaxNbPlaces: maxNbPlaces,
                            eventPitureId: pictureId
                        })];
                case 3:
                    event_3 = _a.sent();
                    if (event_3 instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, event_3);
                    else
                        res.json(event_3);
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
 * suppression d'un événement selon son id
 * URL : /event/delete/:id
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
eventRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, id, success, err_5;
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
                    eventService = new impl_1.EventServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, eventService.deleteEventsById(Number.parseInt(id))];
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
 * s'inscrire à un événement selon son id
 * URL : /event/register/:id
 * Requete : POST
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.post("/register/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, id, userMail, participants, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    userMail = _a.sent();
                    if (userMail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, userMail)];
                    return [4 /*yield*/, eventService.registerEvent(Number.parseInt(id), userMail)];
                case 3:
                    participants = _a.sent();
                    if (participants instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, participants);
                    else
                        res.json(participants);
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
 * se désinscrire d'un événement selon son id
 * URL : /event/unregister/:id
 * Requete : DELETE
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.delete("/unregister/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, id, userMail, participants, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    userMail = _a.sent();
                    if (userMail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, userMail)];
                    return [4 /*yield*/, eventService.unregisterEvent(Number.parseInt(id), userMail)];
                case 3:
                    participants = _a.sent();
                    if (participants instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, participants);
                    else
                        res.json(participants);
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
 * récupérer les événements passés de l'utilisateur connecté
 * URL : /event/getPastEventsByUser
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getPastEventsByUser", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, mail, events, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    mail = _a.sent();
                    if (mail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, mail)];
                    return [4 /*yield*/, eventService.getPastEventsByUser(mail)];
                case 3:
                    events = _a.sent();
                    if (events instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, events);
                    else
                        res.json(events);
                    return [3 /*break*/, 5];
                case 4:
                    err_8 = _a.sent();
                    next(err_8);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les événements futurs de l'utilisateur connecté
 * URL : /event/getFutureEventsByUser
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getFutureEventsByUser", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, mail, events, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    mail = _a.sent();
                    if (mail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, mail)];
                    return [4 /*yield*/, eventService.getFutureEventsByUser(mail)];
                case 3:
                    events = _a.sent();
                    if (events instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, events);
                    else
                        res.json(events);
                    return [3 /*break*/, 5];
                case 4:
                    err_9 = _a.sent();
                    next(err_9);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les événements en cours de l'utilisateur connecté
 * URL : /event/getActualEventsByUser
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getActualEventsByUser", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, mail, events, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    mail = _a.sent();
                    if (mail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, mail)];
                    return [4 /*yield*/, eventService.getActualEventsByUser(mail)];
                case 3:
                    events = _a.sent();
                    if (events instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, events);
                    else
                        res.json(events);
                    return [3 /*break*/, 5];
                case 4:
                    err_10 = _a.sent();
                    next(err_10);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les événements validés
 * URL : /event/getValidatedEvents
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getValidatedEvents", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, events, err_11;
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
                    eventService = new impl_1.EventServiceImpl(connection);
                    return [4 /*yield*/, eventService.getValidatedEvents()];
                case 3:
                    events = _a.sent();
                    if (events instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, events);
                    else
                        res.json(events);
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
 * récupérer les événements en attente
 * URL : /event/getWaitingEvents
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getWaitingEvents", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, events, err_12;
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
                    eventService = new impl_1.EventServiceImpl(connection);
                    return [4 /*yield*/, eventService.getWaitingEvents()];
                case 3:
                    events = _a.sent();
                    if (events instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, events);
                    else
                        res.json(events);
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
 * récupérer les événements refusés
 * URL : /event/getRefusedEvents
 * Requete : GET
 * ACCES : DEV
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getRefusedEvents", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, events, err_13;
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
                    eventService = new impl_1.EventServiceImpl(connection);
                    return [4 /*yield*/, eventService.getRefusedEvents()];
                case 3:
                    events = _a.sent();
                    if (events instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, events);
                    else
                        res.json(events);
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
 * accepter un événement selon son id
 * URL : /event/accept/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
eventRouter.put("/accept/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, id, event_4, err_14;
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
                    eventService = new impl_1.EventServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, eventService.acceptEvent(Number.parseInt(id))];
                case 3:
                    event_4 = _a.sent();
                    if (event_4 instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, event_4);
                    else
                        res.json(event_4);
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
 * refuser un événement selon son id
 * URL : /event/refuse/:id
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV
 * Nécessite d'être connecté : OUI
 */
eventRouter.put("/refuse/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, id, event_5, err_15;
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
                    eventService = new impl_1.EventServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, eventService.refuseEvent(Number.parseInt(id))];
                case 3:
                    event_5 = _a.sent();
                    if (event_5 instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, event_5);
                    else
                        res.json(event_5);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_15 = _a.sent();
                    next(err_15);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer tous les participants d'un événement selon son id
 * URL : /event/getParticipants/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
eventRouter.get("/getParticipants/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, eventService, id, participants, err_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    eventService = new impl_1.EventServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, eventService.getParticipantsEvent(Number.parseInt(id))];
                case 2:
                    participants = _a.sent();
                    if (participants instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, participants);
                    else
                        res.json(participants);
                    return [3 /*break*/, 4];
                case 3:
                    err_16 = _a.sent();
                    next(err_16);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
