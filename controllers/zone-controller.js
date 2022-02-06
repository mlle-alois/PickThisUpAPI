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
exports.ZoneController = void 0;
var models_1 = require("../models");
var media_service_impl_1 = require("../services/impl/media-service-impl");
var ZoneController = /** @class */ (function () {
    function ZoneController(connection) {
        this.connection = connection;
        this.mediaService = new media_service_impl_1.MediaServiceImpl(this.connection);
    }
    ZoneController.prototype.getAllAvailableZones = function (userMail, options) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
                        offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
                        return [4 /*yield*/, this.connection.query("SELECT zone_id,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        zone_description,\n                                                        signalman_id,\n                                                        status_id,\n                                                        ZONE.pollution_level_id,\n                                                        pollution_level_libelle\n                                                 FROM ZONE\n                                                          JOIN POLLUTION_LEVEL\n                                                               ON POLLUTION_LEVEL.pollution_level_id = ZONE.pollution_level_id\n                                                 WHERE status_id = 4\n                                                    OR (status_id = 5 AND signalman_id = ?)\n                                                     AND zone_id NOT IN (SELECT zone_id FROM EVENT)\n                                                 ORDER BY zone_id LIMIT ?, ?", [
                                userMail, offset, limit
                            ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.ZoneModel({
                                        zoneId: row["zone_id"],
                                        zoneStreet: row["zone_street"],
                                        zoneZipcode: row["zone_zipcode"],
                                        zoneCity: row["zone_city"],
                                        zoneDescription: row["zone_description"],
                                        signalmanId: row["signalman_id"],
                                        statusId: row["status_id"],
                                        pollutionLevelId: row["pollution_level_id"],
                                        pollutionLevel: new models_1.PollutionLevelModel({
                                            pollutionLevelId: row["pollution_level_id"],
                                            pollutionLevelLibelle: row["pollution_level_libelle"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ZoneController.prototype.getZoneById = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT zone_id,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        zone_description,\n                                                        signalman_id,\n                                                        status_id,\n                                                        pollution_level_id\n                                                 FROM ZONE\n                                                 where zone_id = ?", [
                            zoneId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.ZoneModel({
                                        zoneId: row["zone_id"],
                                        zoneStreet: row["zone_street"],
                                        zoneZipcode: row["zone_zipcode"],
                                        zoneCity: row["zone_city"],
                                        zoneDescription: row["zone_description"],
                                        signalmanId: row["signalman_id"],
                                        statusId: row["status_id"],
                                        pollutionLevelId: row["pollution_level_id"]
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "Zone not found" })];
                }
            });
        });
    };
    ZoneController.prototype.getMaxZoneId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query('SELECT MAX(zone_id) as maxId FROM ZONE')];
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
    ZoneController.prototype.createZone = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO ZONE (zone_id,\n                                                             zone_street,\n                                                             zone_zipcode,\n                                                             zone_city,\n                                                             zone_description,\n                                                             signalman_id,\n                                                             status_id,\n                                                             pollution_level_id)\n                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                                options.zoneId,
                                options.zoneStreet,
                                options.zoneZipcode,
                                options.zoneCity,
                                options.zoneDescription,
                                options.signalmanId,
                                options.statusId,
                                options.pollutionLevelId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getZoneById(options.zoneId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during zone creation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ZoneController.prototype.deleteZonesById = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM ZONE\n                                                     WHERE zone_id = ?", [
                                zoneId
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
    ZoneController.prototype.updateZone = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, params, res, headers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = [];
                        params = [];
                        if (options.zoneStreet !== undefined) {
                            setClause.push("zone_street = ?");
                            params.push(options.zoneStreet);
                        }
                        if (options.zoneZipcode !== undefined) {
                            setClause.push("zone_zipcode = ?");
                            params.push(options.zoneZipcode);
                        }
                        if (options.zoneCity !== undefined) {
                            setClause.push("zone_city = ?");
                            params.push(options.zoneCity);
                        }
                        if (options.zoneDescription !== undefined) {
                            setClause.push("zone_description = ?");
                            params.push(options.zoneDescription);
                        }
                        if (options.pollutionLevelId !== undefined) {
                            setClause.push("pollution_level_id = ?");
                            params.push(options.pollutionLevelId);
                        }
                        params.push(options.zoneId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("UPDATE ZONE SET ".concat(setClause.join(", "), " WHERE zone_id = ?"), params)];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getZoneById(options.zoneId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The zone update failed" })];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The zone update failed" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ZoneController.prototype.getZonesByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT zone_id,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        zone_description,\n                                                        signalman_id,\n                                                        status_id,\n                                                        ZONE.pollution_level_id,\n                                                        pollution_level_libelle\n                                                 FROM ZONE\n                                                  JOIN POLLUTION_LEVEL\n                                                               ON POLLUTION_LEVEL.pollution_level_id = ZONE.pollution_level_id\n                                                 WHERE signalman_id = ?", [
                            userMail
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.ZoneModel({
                                        zoneId: row["zone_id"],
                                        zoneStreet: row["zone_street"],
                                        zoneZipcode: row["zone_zipcode"],
                                        zoneCity: row["zone_city"],
                                        zoneDescription: row["zone_description"],
                                        signalmanId: row["signalman_id"],
                                        statusId: row["status_id"],
                                        pollutionLevelId: row["pollution_level_id"],
                                        pollutionLevel: new models_1.PollutionLevelModel({
                                            pollutionLevelId: row["pollution_level_id"],
                                            pollutionLevelLibelle: row["pollution_level_libelle"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ZoneController.prototype.getValidatedZones = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT zone_id,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        zone_description,\n                                                        signalman_id,\n                                                        status_id,\n                                                        ZONE.pollution_level_id,\n                                                        pollution_level_libelle\n                                                 FROM ZONE\n                                                          JOIN POLLUTION_LEVEL\n                                                               ON POLLUTION_LEVEL.pollution_level_id = ZONE.pollution_level_id\n                                                 WHERE status_id = 4")];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.ZoneModel({
                                        zoneId: row["zone_id"],
                                        zoneStreet: row["zone_street"],
                                        zoneZipcode: row["zone_zipcode"],
                                        zoneCity: row["zone_city"],
                                        zoneDescription: row["zone_description"],
                                        signalmanId: row["signalman_id"],
                                        statusId: row["status_id"],
                                        pollutionLevelId: row["pollution_level_id"],
                                        pollutionLevel: new models_1.PollutionLevelModel({
                                            pollutionLevelId: row["pollution_level_id"],
                                            pollutionLevelLibelle: row["pollution_level_libelle"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ZoneController.prototype.getWaitingZones = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT zone_id,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        zone_description,\n                                                        signalman_id,\n                                                        status_id,\n                                                        ZONE.pollution_level_id,\n                                                        pollution_level_libelle\n                                                 FROM ZONE\n                                                          JOIN POLLUTION_LEVEL\n                                                               ON POLLUTION_LEVEL.pollution_level_id = ZONE.pollution_level_id\n                                                 WHERE status_id = 5")];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.ZoneModel({
                                        zoneId: row["zone_id"],
                                        zoneStreet: row["zone_street"],
                                        zoneZipcode: row["zone_zipcode"],
                                        zoneCity: row["zone_city"],
                                        zoneDescription: row["zone_description"],
                                        signalmanId: row["signalman_id"],
                                        statusId: row["status_id"],
                                        pollutionLevelId: row["pollution_level_id"],
                                        pollutionLevel: new models_1.PollutionLevelModel({
                                            pollutionLevelId: row["pollution_level_id"],
                                            pollutionLevelLibelle: row["pollution_level_libelle"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ZoneController.prototype.getRefusedZones = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT zone_id,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        zone_description,\n                                                        signalman_id,\n                                                        status_id,\n                                                        ZONE.pollution_level_id,\n                                                        pollution_level_libelle\n                                                 FROM ZONE\n                                                          JOIN POLLUTION_LEVEL\n                                                               ON POLLUTION_LEVEL.pollution_level_id = ZONE.pollution_level_id\n                                                 WHERE status_id = 6")];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.ZoneModel({
                                        zoneId: row["zone_id"],
                                        zoneStreet: row["zone_street"],
                                        zoneZipcode: row["zone_zipcode"],
                                        zoneCity: row["zone_city"],
                                        zoneDescription: row["zone_description"],
                                        signalmanId: row["signalman_id"],
                                        statusId: row["status_id"],
                                        pollutionLevelId: row["pollution_level_id"],
                                        pollutionLevel: new models_1.PollutionLevelModel({
                                            pollutionLevelId: row["pollution_level_id"],
                                            pollutionLevelLibelle: row["pollution_level_libelle"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ZoneController.prototype.getZonesByUserAndStatus = function (userMail, statusId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT zone_id,\n                                                        zone_street,\n                                                        zone_zipcode,\n                                                        zone_city,\n                                                        zone_description,\n                                                        signalman_id,\n                                                        status_id,\n                                                        pollution_level_id\n                                                 FROM ZONE\n                                                 WHERE signalman_id = ?\n                                                   AND status_id = ?", [
                            userMail, statusId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.ZoneModel({
                                        zoneId: row["zone_id"],
                                        zoneStreet: row["zone_street"],
                                        zoneZipcode: row["zone_zipcode"],
                                        zoneCity: row["zone_city"],
                                        zoneDescription: row["zone_description"],
                                        signalmanId: row["signalman_id"],
                                        statusId: row["status_id"],
                                        pollutionLevelId: row["pollution_level_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ZoneController.prototype.acceptZone = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.execute("UPDATE ZONE\n                                                       SET status_id = 4\n                                                       WHERE zone_id = ?", [
                                zoneId
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getZoneById(zoneId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The zone validation failed" })];
                    case 2:
                        err_4 = _a.sent();
                        console.error(err_4);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The zone validation failed" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ZoneController.prototype.refuseZone = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, res2, headers2, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.connection.execute("UPDATE ZONE\n                                                       SET status_id = 6\n                                                       WHERE zone_id = ?", [
                                zoneId
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (!(headers.affectedRows > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.connection.execute("UPDATE EVENT\n                                                       SET status_id = 6\n                                                       WHERE zone_id = ?", [
                                zoneId
                            ])];
                    case 2:
                        res2 = _a.sent();
                        headers2 = res2[0];
                        if (headers2.affectedRows > 0) {
                            return [2 /*return*/, this.getZoneById(zoneId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The zone refusal failed" })];
                    case 3: return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The zone refusal failed" })];
                    case 4:
                        err_5 = _a.sent();
                        console.error(err_5);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The zone refusal failed" })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ZoneController.prototype.addMediaToZone = function (mediaId, zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO HAVE_ZONE_PICTURES (media_id, zone_id)\n                                           VALUES (?, ?)", [
                                mediaId, zoneId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.mediaService.getMediaById(mediaId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_6 = _a.sent();
                        console.error(err_6);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during media creation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ZoneController.prototype.removeMediaToZone = function (mediaId, zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM HAVE_ZONE_PICTURES\n                                                     WHERE media_id = ?\n                                                       AND zone_id = ?", [
                                mediaId, zoneId
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 2:
                        err_7 = _a.sent();
                        console.error(err_7);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ZoneController.prototype.getMediaZonesById = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT MEDIA.media_id, media_path\n                                                 FROM MEDIA\n                                                          JOIN HAVE_ZONE_PICTURES ON MEDIA.media_id = HAVE_ZONE_PICTURES.media_id\n                                                 WHERE zone_id = ?", [
                            zoneId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.MediaModel({
                                        mediaId: row["media_id"],
                                        mediaPath: row["media_path"]
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    return ZoneController;
}());
exports.ZoneController = ZoneController;
