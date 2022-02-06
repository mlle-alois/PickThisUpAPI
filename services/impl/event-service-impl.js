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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var models_1 = require("../../models");
var user_service_impl_1 = require("./user-service-impl");
var status_service_impl_1 = require("./status-service-impl");
var media_service_impl_1 = require("./media-service-impl");
var zone_service_impl_1 = require("./zone-service-impl");
var EventServiceImpl = /** @class */ (function () {
    function EventServiceImpl(connection) {
        this.connection = connection;
        this.eventController = new controllers_1.EventController(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
        this.statusService = new status_service_impl_1.StatusServiceImpl(this.connection);
        this.mediaServcice = new media_service_impl_1.MediaServiceImpl(this.connection);
        this.zoneService = new zone_service_impl_1.ZoneServiceImpl(this.connection);
    }
    /**
     * Récupération de tous les events validés
     * @param options -> Limit et offset de la requete
     */
    EventServiceImpl.prototype.getAllValidatedEvents = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.eventController.getAllValidatedEvents(options)];
            });
        });
    };
    /**
     * Récupération de l'id de event maximum existant
     */
    EventServiceImpl.prototype.getMaxEventId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.eventController.getMaxEventId()];
            });
        });
    };
    /**
     * Récupération d'un événement depuis son :
     * @param eventId
     */
    EventServiceImpl.prototype.getEventById = function (eventId) {
        return this.eventController.getEventById(eventId);
    };
    /**
     * Création d'un event
     * @param options
     */
    EventServiceImpl.prototype.createEvent = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var status, picture, creator, zone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.statusService.getStatusById(options.statusId)];
                    case 1:
                        status = _a.sent();
                        if (status instanceof models_1.LogError)
                            return [2 /*return*/, status];
                        return [4 /*yield*/, this.mediaServcice.getMediaById(options.eventPitureId)];
                    case 2:
                        picture = _a.sent();
                        if (picture instanceof models_1.LogError)
                            return [2 /*return*/, picture];
                        return [4 /*yield*/, this.userService.getUserByMail(options.creatorId)];
                    case 3:
                        creator = _a.sent();
                        if (creator instanceof models_1.LogError)
                            return [2 /*return*/, creator];
                        return [4 /*yield*/, this.zoneService.getZoneById(options.zoneId)];
                    case 4:
                        zone = _a.sent();
                        if (zone instanceof models_1.LogError)
                            return [2 /*return*/, zone];
                        return [2 /*return*/, this.eventController.createEvent(options)];
                }
            });
        });
    };
    /**
     * suppression deu événement selon son id
     * @param eventId
     */
    EventServiceImpl.prototype.deleteEventsById = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEventById(eventId)];
                    case 1:
                        event = _a.sent();
                        if (event instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [2 /*return*/, this.eventController.deleteEventsById(eventId)];
                }
            });
        });
    };
    /**
     * Modification des informations d'un événement renseignées dans les options
     * @param options
     */
    EventServiceImpl.prototype.updateEvent = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var picture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(options.eventPitureId !== undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.mediaServcice.getMediaById(options.eventPitureId)];
                    case 1:
                        picture = _a.sent();
                        if (picture instanceof models_1.LogError)
                            return [2 /*return*/, picture];
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.eventController.updateEvent(options)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * s'inscrire à un événement
     * @param eventId
     * @param userMail
     */
    EventServiceImpl.prototype.registerEvent = function (eventId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var event, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEventById(eventId)];
                    case 1:
                        event = _a.sent();
                        if (event instanceof models_1.LogError)
                            return [2 /*return*/, event];
                        return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.eventController.registerEvent(eventId, userMail)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * se désinscrire d'un événement
     * @param eventId
     * @param userMail
     */
    EventServiceImpl.prototype.unregisterEvent = function (eventId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var event, user, participants, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEventById(eventId)];
                    case 1:
                        event = _a.sent();
                        if (event instanceof models_1.LogError)
                            return [2 /*return*/, event];
                        return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.eventController.unregisterEvent(eventId, userMail)];
                    case 3:
                        participants = _a.sent();
                        if (participants instanceof models_1.LogError)
                            return [2 /*return*/, participants];
                        return [4 /*yield*/, this.eventController.deleteEventCarpoolsOfUser(eventId, userMail)];
                    case 4:
                        success = _a.sent();
                        if (success instanceof models_1.LogError)
                            return [2 /*return*/, success];
                        return [2 /*return*/, participants];
                }
            });
        });
    };
    /**
     * récupérer les événements passés d'un utilisateur
     * @param userMail
     */
    EventServiceImpl.prototype.getPastEventsByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, new models_1.LogError({ numError: 404, text: "User don't exists" })];
                        return [4 /*yield*/, this.eventController.getPastEventsByUser(userMail)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les événements futurs d'un utilisateur
     * @param userMail
     */
    EventServiceImpl.prototype.getFutureEventsByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, new models_1.LogError({ numError: 404, text: "User don't exists" })];
                        return [4 /*yield*/, this.eventController.getFutureEventsByUser(userMail)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les événements en cours d'un utilisateur
     * @param userMail
     */
    EventServiceImpl.prototype.getActualEventsByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, new models_1.LogError({ numError: 404, text: "User don't exists" })];
                        return [4 /*yield*/, this.eventController.getActualEventsByUser(userMail)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les événements validés
     */
    EventServiceImpl.prototype.getValidatedEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventController.getValidatedEvents()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les événements en attente
     */
    EventServiceImpl.prototype.getWaitingEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventController.getWaitingEvents()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les événements refusés
     */
    EventServiceImpl.prototype.getRefusedEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventController.getRefusedEvents()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * accepter un événement
     * @param eventId
     */
    EventServiceImpl.prototype.acceptEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEventById(eventId)];
                    case 1:
                        event = _a.sent();
                        if (event instanceof models_1.LogError)
                            return [2 /*return*/, new models_1.LogError({ numError: 404, text: "Event don't exists" })];
                        return [4 /*yield*/, this.eventController.acceptEvent(eventId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * refuser un événement
     * @param eventId
     */
    EventServiceImpl.prototype.refuseEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEventById(eventId)];
                    case 1:
                        event = _a.sent();
                        if (event instanceof models_1.LogError)
                            return [2 /*return*/, new models_1.LogError({ numError: 404, text: "Event don't exists" })];
                        return [4 /*yield*/, this.eventController.refuseEvent(eventId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer tous les participants d'un événement
     * @param eventId
     */
    EventServiceImpl.prototype.getParticipantsEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEventById(eventId)];
                    case 1:
                        event = _a.sent();
                        if (event instanceof models_1.LogError)
                            return [2 /*return*/, new models_1.LogError({ numError: 404, text: "Event don't exists" })];
                        return [4 /*yield*/, this.eventController.getParticipantsEvent(eventId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return EventServiceImpl;
}());
exports.EventServiceImpl = EventServiceImpl;
