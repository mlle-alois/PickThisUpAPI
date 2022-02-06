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
exports.ZoneServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var models_1 = require("../../models");
var user_service_impl_1 = require("./user-service-impl");
var status_service_impl_1 = require("./status-service-impl");
var media_service_impl_1 = require("./media-service-impl");
var pollution_level_service_impl_1 = require("./pollution-level-service-impl");
/**
 * Zone = Signalement
 */
var ZoneServiceImpl = /** @class */ (function () {
    function ZoneServiceImpl(connection) {
        this.connection = connection;
        this.zoneController = new controllers_1.ZoneController(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
        this.statusService = new status_service_impl_1.StatusServiceImpl(this.connection);
        this.mediaService = new media_service_impl_1.MediaServiceImpl(this.connection);
        this.pollutionLevelService = new pollution_level_service_impl_1.PollutionLevelServiceImpl(this.connection);
    }
    /**
     * Récupération de toutes les zones disponibles :
     * validées ou en attente pour celles de l'utilisateur connecté
     * pas encore associées à un événement validé ou en attente
     * @param userMail
     * @param options -> Limit et offset de la requete
     */
    ZoneServiceImpl.prototype.getAllAvailableZones = function (userMail, options) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [2 /*return*/, this.zoneController.getAllAvailableZones(userMail, options)];
                }
            });
        });
    };
    /**
     * Récupération de l'id de zone maximum existant
     */
    ZoneServiceImpl.prototype.getMaxZoneId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.zoneController.getMaxZoneId()];
            });
        });
    };
    /**
     * Récupération d'un événement depuis son :
     * @param zoneId
     */
    ZoneServiceImpl.prototype.getZoneById = function (zoneId) {
        return this.zoneController.getZoneById(zoneId);
    };
    /**
     * Création d'une zone
     * @param options
     */
    ZoneServiceImpl.prototype.createZone = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var signalman, status, pollutionLevel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(options.signalmanId)];
                    case 1:
                        signalman = _a.sent();
                        if (signalman instanceof models_1.LogError)
                            return [2 /*return*/, signalman];
                        return [4 /*yield*/, this.statusService.getStatusById(options.statusId)];
                    case 2:
                        status = _a.sent();
                        if (status instanceof models_1.LogError)
                            return [2 /*return*/, status];
                        return [4 /*yield*/, this.pollutionLevelService.getPollutionLevelById(options.pollutionLevelId)];
                    case 3:
                        pollutionLevel = _a.sent();
                        if (pollutionLevel instanceof models_1.LogError)
                            return [2 /*return*/, pollutionLevel];
                        return [2 /*return*/, this.zoneController.createZone(options)];
                }
            });
        });
    };
    /**
     * suppression d'une zone selon son id
     * @param zoneId
     */
    ZoneServiceImpl.prototype.deleteZoneById = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var zone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getZoneById(zoneId)];
                    case 1:
                        zone = _a.sent();
                        if (zone instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [2 /*return*/, this.zoneController.deleteZonesById(zoneId)];
                }
            });
        });
    };
    /**
     * Modification des informations d'unr zone renseignées dans les options
     * @param options
     */
    ZoneServiceImpl.prototype.updateZone = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var pollutionLevel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pollutionLevelService.getPollutionLevelById(options.pollutionLevelId)];
                    case 1:
                        pollutionLevel = _a.sent();
                        if (pollutionLevel instanceof models_1.LogError)
                            return [2 /*return*/, pollutionLevel];
                        return [4 /*yield*/, this.zoneController.updateZone(options)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les zones d'un utilisateur
     * @param userMail
     */
    ZoneServiceImpl.prototype.getZonesByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.zoneController.getZonesByUser(userMail)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les zones validées
     */
    ZoneServiceImpl.prototype.getValidatedZones = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.zoneController.getValidatedZones()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les zones en attente
     */
    ZoneServiceImpl.prototype.getWaitingZones = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.zoneController.getWaitingZones()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les zones refusées
     */
    ZoneServiceImpl.prototype.getRefusedZones = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.zoneController.getRefusedZones()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les zones d'un utilisateur selon leur statut
     * @param userMail
     * @param statusId
     */
    ZoneServiceImpl.prototype.getZonesByUserAndStatus = function (userMail, statusId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.statusService.getStatusById(statusId)];
                    case 2:
                        status = _a.sent();
                        if (status instanceof models_1.LogError)
                            return [2 /*return*/, status];
                        return [4 /*yield*/, this.zoneController.getZonesByUserAndStatus(userMail, statusId)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * accepter une zone
     * @param zoneId
     */
    ZoneServiceImpl.prototype.acceptZone = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var zone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getZoneById(zoneId)];
                    case 1:
                        zone = _a.sent();
                        if (zone instanceof models_1.LogError)
                            return [2 /*return*/, zone];
                        return [4 /*yield*/, this.zoneController.acceptZone(zoneId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * refuser une zone
     * @param zoneId
     */
    ZoneServiceImpl.prototype.refuseZone = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var zone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getZoneById(zoneId)];
                    case 1:
                        zone = _a.sent();
                        if (zone instanceof models_1.LogError)
                            return [2 /*return*/, zone];
                        return [4 /*yield*/, this.zoneController.refuseZone(zoneId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Création d'un media
     * @param options
     * @param zoneId
     */
    ZoneServiceImpl.prototype.addMediaToZone = function (options, zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var zone, media;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getZoneById(zoneId)];
                    case 1:
                        zone = _a.sent();
                        if (zone instanceof models_1.LogError)
                            return [2 /*return*/, zone];
                        return [4 /*yield*/, this.mediaService.createMedia(options)];
                    case 2:
                        media = _a.sent();
                        if (media instanceof models_1.LogError)
                            return [2 /*return*/, media];
                        return [2 /*return*/, this.zoneController.addMediaToZone(media.mediaId, zoneId)];
                }
            });
        });
    };
    /**
     * suppression d'un media selon son id
     * @param mediaId
     * @param zoneId
     */
    ZoneServiceImpl.prototype.removeMediaToZone = function (mediaId, zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var media, zone, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mediaService.getMediaById(mediaId)];
                    case 1:
                        media = _a.sent();
                        if (media instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.getZoneById(zoneId)];
                    case 2:
                        zone = _a.sent();
                        if (zone instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        success = this.zoneController.removeMediaToZone(mediaId, zoneId);
                        if (!success)
                            return [2 /*return*/, false];
                        return [2 /*return*/, this.mediaService.deleteMedia(mediaId)];
                }
            });
        });
    };
    ZoneServiceImpl.prototype.getMediaZonesById = function (zoneId) {
        return __awaiter(this, void 0, void 0, function () {
            var zone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getZoneById(zoneId)];
                    case 1:
                        zone = _a.sent();
                        if (zone instanceof models_1.LogError)
                            return [2 /*return*/, zone];
                        return [2 /*return*/, this.zoneController.getMediaZonesById(zoneId)];
                }
            });
        });
    };
    return ZoneServiceImpl;
}());
exports.ZoneServiceImpl = ZoneServiceImpl;
