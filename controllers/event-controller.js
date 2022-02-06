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
exports.EventController = void 0;
var models_1 = require("../models");
var user_controller_1 = require("./user-controller");
var EventController = /** @class */ (function () {
    function EventController(connection) {
        this.connection = connection;
    }
    EventController.prototype.getAllValidatedEvents = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
                        offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
                        return [4 /*yield*/, this.connection.query("SELECT EVENT.event_id,\n                                                        event_title,\n                                                        event_description,\n                                                        date_hour_start,\n                                                        date_hour_start > NOW()                                as isFuture,\n                                                        date_hour_end,\n                                                        date_hour_creation,\n                                                        event_max_nb_places,\n                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,\n                                                        event_picture_id,\n                                                        coalesce(media_path, \"pickThisUpLogo.PNG\")             as media_path,\n                                                        EVENT.status_id                                        as event_status_id,\n                                                        creator_id,\n                                                        EVENT.zone_id                                          as zone_id,\n                                                        zone_description,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        ZONE.status_id                                         as zone_status_id,\n                                                        signalman_id,\n                                                        pollution_level_id\n                                                 FROM EVENT\n                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id\n                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id\n                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id\n                                                 WHERE EVENT.status_id = 4\n                                                 GROUP BY EVENT.event_id, event_title\n                                                 ORDER BY isFuture DESC, date_hour_start ASC LIMIT ?, ?", [
                                offset, limit
                            ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.EventModel({
                                        eventId: row["event_id"],
                                        eventTitle: row["event_title"],
                                        eventDescription: row["event_description"],
                                        dateHourStart: row["date_hour_start"],
                                        dateHourEnd: row["date_hour_end"],
                                        dateHourCreation: row["date_hour_creation"],
                                        eventMaxNbPlaces: row["event_max_nb_places"],
                                        eventRemainingPlaces: row["event_remaining_places"],
                                        eventPitureId: row["event_picture_id"],
                                        picture: new models_1.MediaModel({
                                            mediaId: row["event_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        statusId: row["event_status_id"],
                                        creatorId: row["creator_id"],
                                        zoneId: row["zone_id"],
                                        zone: new models_1.ZoneModel({
                                            zoneId: row["zone_id"],
                                            zoneDescription: row["zone_description"],
                                            zoneStreet: row["zone_street"],
                                            zoneZipcode: row["zone_zipcode"],
                                            zoneCity: row["zone_city"],
                                            statusId: row["zone_status_id"],
                                            signalmanId: row["signalman_id"],
                                            pollutionLevelId: row["pollution_level_id"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    EventController.prototype.getEventById = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT event_id,\n                                                        event_title,\n                                                        event_description,\n                                                        date_hour_start,\n                                                        date_hour_end,\n                                                        date_hour_creation,\n                                                        event_max_nb_places,\n                                                        event_picture_id,\n                                                        status_id,\n                                                        creator_id,\n                                                        zone_id\n                                                 FROM EVENT\n                                                 where event_id = ?", [
                            eventId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.EventModel({
                                        eventId: row["event_id"],
                                        eventTitle: row["event_title"],
                                        eventDescription: row["event_description"],
                                        dateHourStart: row["date_hour_start"],
                                        dateHourEnd: row["date_hour_end"],
                                        dateHourCreation: row["date_hour_creation"],
                                        eventMaxNbPlaces: row["event_max_nb_places"],
                                        eventPitureId: row["event_picture_id"],
                                        statusId: row["status_id"],
                                        creatorId: row["creator_id"],
                                        zoneId: row["zone_id"]
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "Event not found" })];
                }
            });
        });
    };
    EventController.prototype.getMaxEventId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query('SELECT MAX(event_id) as maxId FROM EVENT')];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                if (row["maxId"] === null) {
                                    return [2 /*return*/, 0];
                                }
                                else {
                                    return [2 /*return*/, row["maxId"]];
                                }
                            }
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    EventController.prototype.createEvent = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO EVENT (event_id,\n                                                              event_title,\n                                                              event_description,\n                                                              date_hour_start,\n                                                              date_hour_end,\n                                                              date_hour_creation,\n                                                              event_max_nb_places,\n                                                              event_picture_id,\n                                                              status_id,\n                                                              creator_id,\n                                                              zone_id)\n                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                                options.eventId,
                                options.eventTitle,
                                options.eventDescription,
                                new Date(options.dateHourStart),
                                new Date(options.dateHourEnd),
                                options.dateHourCreation,
                                options.eventMaxNbPlaces,
                                options.eventPitureId,
                                options.statusId,
                                options.creatorId,
                                options.zoneId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getEventById(options.eventId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during event creation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EventController.prototype.deleteEventsById = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM EVENT\n                                                     WHERE event_id = ?", [
                                eventId
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 2:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EventController.prototype.updateEvent = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, params, res, headers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = [];
                        params = [];
                        //création des contenus de la requête dynamiquement
                        if (options.eventTitle !== undefined) {
                            setClause.push("event_title = ?");
                            params.push(options.eventTitle);
                        }
                        if (options.eventDescription !== undefined) {
                            setClause.push("event_description = ?");
                            params.push(options.eventDescription);
                        }
                        if (options.dateHourStart !== undefined) {
                            setClause.push("date_hour_start = ?");
                            params.push(new Date(options.dateHourStart));
                        }
                        if (options.dateHourEnd !== undefined) {
                            setClause.push("date_hour_end = ?");
                            params.push(new Date(options.dateHourEnd));
                        }
                        if (options.eventMaxNbPlaces !== undefined) {
                            setClause.push("event_max_nb_places = ?");
                            params.push(options.eventMaxNbPlaces);
                        }
                        if (options.eventPitureId !== undefined) {
                            setClause.push("event_picture_id = ?");
                            params.push(options.eventPitureId);
                        }
                        params.push(options.eventId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("UPDATE EVENT SET ".concat(setClause.join(", "), " WHERE event_id = ?"), params)];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getEventById(options.eventId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The event update failed" })];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The event update failed" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EventController.prototype.registerEvent = function (eventId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO PARTICIPATE_USER_EVENT (user_id, event_id)\n                                           VALUES (?, ?)", [
                                userMail, eventId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getParticipantsEvent(eventId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_4 = _a.sent();
                        console.error(err_4);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during registration" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EventController.prototype.unregisterEvent = function (eventId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("DELETE\n                                           FROM PARTICIPATE_USER_EVENT\n                                           WHERE user_id = ?\n                                             AND event_id = ?", [
                                userMail, eventId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getParticipantsEvent(eventId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_5 = _a.sent();
                        console.error(err_5);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during unregistration" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EventController.prototype.getPastEventsByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT EVENT.event_id,\n                                                        event_title,\n                                                        event_description,\n                                                        date_hour_start,\n                                                        date_hour_start > NOW()                                as isFuture,\n                                                        date_hour_end,\n                                                        date_hour_creation,\n                                                        event_max_nb_places,\n                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,\n                                                        event_picture_id,\n                                                        coalesce(media_path, \"pickThisUpLogo.PNG\")             as media_path,\n                                                        EVENT.status_id                                        as event_status_id,\n                                                        creator_id,\n                                                        EVENT.zone_id                                          as zone_id,\n                                                        zone_description,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        ZONE.status_id                                         as zone_status_id,\n                                                        signalman_id,\n                                                        pollution_level_id\n                                                 FROM EVENT\n                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id\n                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id\n                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id\n                                                    WHERE ( creator_id = ? OR user_id = ? )\n                                                AND date_hour_end < NOW()\n                                                GROUP BY EVENT.event_id, event_title\n                                                 ORDER BY EVENT.status_id ASC, date_hour_start DESC", [
                            userMail, userMail
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.EventModel({
                                        eventId: row["event_id"],
                                        eventTitle: row["event_title"],
                                        eventDescription: row["event_description"],
                                        dateHourStart: row["date_hour_start"],
                                        dateHourEnd: row["date_hour_end"],
                                        dateHourCreation: row["date_hour_creation"],
                                        eventMaxNbPlaces: row["event_max_nb_places"],
                                        eventRemainingPlaces: row["event_remaining_places"],
                                        eventPitureId: row["event_picture_id"],
                                        picture: new models_1.MediaModel({
                                            mediaId: row["event_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        statusId: row["event_status_id"],
                                        creatorId: row["creator_id"],
                                        zoneId: row["zone_id"],
                                        zone: new models_1.ZoneModel({
                                            zoneId: row["zone_id"],
                                            zoneDescription: row["zone_description"],
                                            zoneStreet: row["zone_street"],
                                            zoneZipcode: row["zone_zipcode"],
                                            zoneCity: row["zone_city"],
                                            statusId: row["zone_status_id"],
                                            signalmanId: row["signalman_id"],
                                            pollutionLevelId: row["pollution_level_id"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    EventController.prototype.getFutureEventsByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT EVENT.event_id,\n                                                        event_title,\n                                                        event_description,\n                                                        date_hour_start,\n                                                        date_hour_end,\n                                                        date_hour_creation,\n                                                        event_max_nb_places,\n                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,\n                                                        event_picture_id,\n                                                        coalesce(media_path, \"pickThisUpLogo.PNG\")             as media_path,\n                                                        EVENT.status_id                                        as event_status_id,\n                                                        creator_id,\n                                                        EVENT.zone_id                                          as zone_id,\n                                                        zone_description,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        ZONE.status_id                                         as zone_status_id,\n                                                        signalman_id,\n                                                        pollution_level_id\n                                                 FROM EVENT\n                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id\n                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id\n                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id\n                                               WHERE ( creator_id = ? OR user_id = ? )\n                                                AND date_hour_start > NOW()\n                                                GROUP BY EVENT.event_id, event_title\n                                                 ORDER BY EVENT.status_id ASC, date_hour_start DESC", [
                            userMail, userMail
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.EventModel({
                                        eventId: row["event_id"],
                                        eventTitle: row["event_title"],
                                        eventDescription: row["event_description"],
                                        dateHourStart: row["date_hour_start"],
                                        dateHourEnd: row["date_hour_end"],
                                        dateHourCreation: row["date_hour_creation"],
                                        eventMaxNbPlaces: row["event_max_nb_places"],
                                        eventRemainingPlaces: row["event_remaining_places"],
                                        eventPitureId: row["event_picture_id"],
                                        picture: new models_1.MediaModel({
                                            mediaId: row["event_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        statusId: row["event_status_id"],
                                        creatorId: row["creator_id"],
                                        zoneId: row["zone_id"],
                                        zone: new models_1.ZoneModel({
                                            zoneId: row["zone_id"],
                                            zoneDescription: row["zone_description"],
                                            zoneStreet: row["zone_street"],
                                            zoneZipcode: row["zone_zipcode"],
                                            zoneCity: row["zone_city"],
                                            statusId: row["zone_status_id"],
                                            signalmanId: row["signalman_id"],
                                            pollutionLevelId: row["pollution_level_id"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    EventController.prototype.getActualEventsByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT EVENT.event_id,\n                                                        event_title,\n                                                        event_description,\n                                                        date_hour_start,\n                                                        date_hour_start > NOW()                                as isFuture,\n                                                        date_hour_end,\n                                                        date_hour_creation,\n                                                        event_max_nb_places,\n                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,\n                                                        event_picture_id,\n                                                        coalesce(media_path, \"pickThisUpLogo.PNG\")             as media_path,\n                                                        EVENT.status_id                                        as event_status_id,\n                                                        creator_id,\n                                                        EVENT.zone_id                                          as zone_id,\n                                                        zone_description,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        ZONE.status_id                                         as zone_status_id,\n                                                        signalman_id,\n                                                        pollution_level_id\n                                                 FROM EVENT\n                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id\n                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id\n                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id\n                                                    WHERE ( creator_id = ? OR user_id = ? )\n                                                      AND date_hour_start < NOW()\n                                                      AND date_hour_end > NOW()\n                                                      GROUP BY EVENT.event_id, event_title\n                                                    ORDER BY EVENT.status_id ASC, date_hour_start DESC", [
                            userMail, userMail
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.EventModel({
                                        eventId: row["event_id"],
                                        eventTitle: row["event_title"],
                                        eventDescription: row["event_description"],
                                        dateHourStart: row["date_hour_start"],
                                        dateHourEnd: row["date_hour_end"],
                                        dateHourCreation: row["date_hour_creation"],
                                        eventMaxNbPlaces: row["event_max_nb_places"],
                                        eventRemainingPlaces: row["event_remaining_places"],
                                        eventPitureId: row["event_picture_id"],
                                        picture: new models_1.MediaModel({
                                            mediaId: row["event_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        statusId: row["event_status_id"],
                                        creatorId: row["creator_id"],
                                        zoneId: row["zone_id"],
                                        zone: new models_1.ZoneModel({
                                            zoneId: row["zone_id"],
                                            zoneDescription: row["zone_description"],
                                            zoneStreet: row["zone_street"],
                                            zoneZipcode: row["zone_zipcode"],
                                            zoneCity: row["zone_city"],
                                            statusId: row["zone_status_id"],
                                            signalmanId: row["signalman_id"],
                                            pollutionLevelId: row["pollution_level_id"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    /**
     * trié dans la date décroissante pour voir les derniers validés
     */
    EventController.prototype.getValidatedEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT EVENT.event_id,\n                                                        event_title,\n                                                        event_description,\n                                                        date_hour_start,\n                                                        date_hour_start > NOW()                                as isFuture,\n                                                        date_hour_end,\n                                                        date_hour_creation,\n                                                        event_max_nb_places,\n                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,\n                                                        event_picture_id,\n                                                        coalesce(media_path, \"pickThisUpLogo.PNG\")             as media_path,\n                                                        EVENT.status_id                                        as event_status_id,\n                                                        creator_id,\n                                                        EVENT.zone_id                                          as zone_id,\n                                                        zone_description,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        ZONE.status_id                                         as zone_status_id,\n                                                        signalman_id,\n                                                        pollution_level_id\n                                                 FROM EVENT\n                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id\n                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id\n                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id\n                                                 WHERE EVENT.status_id = 4\n                                                 GROUP BY EVENT.event_id, event_title\n                                                 ORDER BY date_hour_start DESC")];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.EventModel({
                                        eventId: row["event_id"],
                                        eventTitle: row["event_title"],
                                        eventDescription: row["event_description"],
                                        dateHourStart: row["date_hour_start"],
                                        dateHourEnd: row["date_hour_end"],
                                        dateHourCreation: row["date_hour_creation"],
                                        eventMaxNbPlaces: row["event_max_nb_places"],
                                        eventRemainingPlaces: row["event_remaining_places"],
                                        eventPitureId: row["event_picture_id"],
                                        picture: new models_1.MediaModel({
                                            mediaId: row["event_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        statusId: row["event_status_id"],
                                        creatorId: row["creator_id"],
                                        zoneId: row["zone_id"],
                                        zone: new models_1.ZoneModel({
                                            zoneId: row["zone_id"],
                                            zoneDescription: row["zone_description"],
                                            zoneStreet: row["zone_street"],
                                            zoneZipcode: row["zone_zipcode"],
                                            zoneCity: row["zone_city"],
                                            statusId: row["zone_status_id"],
                                            signalmanId: row["signalman_id"],
                                            pollutionLevelId: row["pollution_level_id"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    /**
     * trié par date la plus proche pour traiter les événements qui arrivent le plus tôt
     */
    EventController.prototype.getWaitingEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT EVENT.event_id,\n                                                        event_title,\n                                                        event_description,\n                                                        date_hour_start,\n                                                        date_hour_start > NOW()                                as isFuture,\n                                                        date_hour_end,\n                                                        date_hour_creation,\n                                                        event_max_nb_places,\n                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,\n                                                        event_picture_id,\n                                                        coalesce(media_path, \"pickThisUpLogo.PNG\")             as media_path,\n                                                        EVENT.status_id                                        as event_status_id,\n                                                        creator_id,\n                                                        EVENT.zone_id                                          as zone_id,\n                                                        zone_description,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        ZONE.status_id                                         as zone_status_id,\n                                                        signalman_id,\n                                                        pollution_level_id\n                                                 FROM EVENT\n                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id\n                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id\n                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id\n                                                 WHERE EVENT.status_id = 5\n                                                 GROUP BY EVENT.event_id, event_title\n                                                 ORDER BY date_hour_start")];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.EventModel({
                                        eventId: row["event_id"],
                                        eventTitle: row["event_title"],
                                        eventDescription: row["event_description"],
                                        dateHourStart: row["date_hour_start"],
                                        dateHourEnd: row["date_hour_end"],
                                        dateHourCreation: row["date_hour_creation"],
                                        eventMaxNbPlaces: row["event_max_nb_places"],
                                        eventRemainingPlaces: row["event_remaining_places"],
                                        eventPitureId: row["event_picture_id"],
                                        picture: new models_1.MediaModel({
                                            mediaId: row["event_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        statusId: row["event_status_id"],
                                        creatorId: row["creator_id"],
                                        zoneId: row["zone_id"],
                                        zone: new models_1.ZoneModel({
                                            zoneId: row["zone_id"],
                                            zoneDescription: row["zone_description"],
                                            zoneStreet: row["zone_street"],
                                            zoneZipcode: row["zone_zipcode"],
                                            zoneCity: row["zone_city"],
                                            statusId: row["zone_status_id"],
                                            signalmanId: row["signalman_id"],
                                            pollutionLevelId: row["pollution_level_id"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    /**
     * trié dans la date décroissante pour voir les derniers refusés
     */
    EventController.prototype.getRefusedEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT EVENT.event_id,\n                                                        event_title,\n                                                        event_description,\n                                                        date_hour_start,\n                                                        date_hour_start > NOW()                                as isFuture,\n                                                        date_hour_end,\n                                                        date_hour_creation,\n                                                        event_max_nb_places,\n                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,\n                                                        event_picture_id,\n                                                        coalesce(media_path, \"pickThisUpLogo.PNG\")             as media_path,\n                                                        EVENT.status_id                                        as event_status_id,\n                                                        creator_id,\n                                                        EVENT.zone_id                                          as zone_id,\n                                                        zone_description,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        ZONE.status_id                                         as zone_status_id,\n                                                        signalman_id,\n                                                        pollution_level_id\n                                                 FROM EVENT\n                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id\n                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id\n                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id\n                                                 WHERE EVENT.status_id = 6\n                                                 GROUP BY EVENT.event_id, event_title\n                                                 ORDER BY date_hour_start DESC")];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.EventModel({
                                        eventId: row["event_id"],
                                        eventTitle: row["event_title"],
                                        eventDescription: row["event_description"],
                                        dateHourStart: row["date_hour_start"],
                                        dateHourEnd: row["date_hour_end"],
                                        dateHourCreation: row["date_hour_creation"],
                                        eventMaxNbPlaces: row["event_max_nb_places"],
                                        eventRemainingPlaces: row["event_remaining_places"],
                                        eventPitureId: row["event_picture_id"],
                                        picture: new models_1.MediaModel({
                                            mediaId: row["event_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        statusId: row["event_status_id"],
                                        creatorId: row["creator_id"],
                                        zoneId: row["zone_id"],
                                        zone: new models_1.ZoneModel({
                                            zoneId: row["zone_id"],
                                            zoneDescription: row["zone_description"],
                                            zoneStreet: row["zone_street"],
                                            zoneZipcode: row["zone_zipcode"],
                                            zoneCity: row["zone_city"],
                                            statusId: row["zone_status_id"],
                                            signalmanId: row["signalman_id"],
                                            pollutionLevelId: row["pollution_level_id"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    EventController.prototype.acceptEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.execute("UPDATE EVENT\n                                                       SET status_id = 4\n                                                       WHERE event_id = ?", [
                                eventId
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getEventById(eventId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The event validation failed" })];
                    case 2:
                        err_6 = _a.sent();
                        console.error(err_6);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The event validation failed" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EventController.prototype.refuseEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.execute("UPDATE EVENT\n                                                       SET status_id = 6\n                                                       WHERE event_id = ?", [
                                eventId
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getEventById(eventId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The event refusal failed" })];
                    case 2:
                        err_7 = _a.sent();
                        console.error(err_7);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The event refusal failed" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EventController.prototype.getParticipantsEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        user_type_id\n                                                 FROM ".concat(user_controller_1.UserController.userTable, "\n                                                          JOIN PARTICIPATE_USER_EVENT ON user_mail = user_id\n                                                 WHERE event_id = ?"), [
                            eventId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.UserModel({
                                        mail: row["user_mail"],
                                        password: row["user_password"],
                                        firstname: row["user_firstname"],
                                        name: row["user_name"],
                                        phoneNumber: row["user_phone_number"],
                                        profilePictureId: row["profile_picture_id"],
                                        typeId: row["user_type_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    EventController.prototype.deleteEventCarpoolsOfUser = function (eventId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.execute("DELETE\n                                           FROM CARPOOL\n                                           WHERE conductor_id = ?\n                                             AND event_id = ?", [
                                userMail, eventId
                            ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_8 = _a.sent();
                        console.error(err_8);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during deletion of user's carpools" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return EventController;
}());
exports.EventController = EventController;
