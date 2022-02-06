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
exports.CarpoolServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var models_1 = require("../../models");
var user_service_impl_1 = require("./user-service-impl");
var event_service_impl_1 = require("./event-service-impl");
var CarpoolServiceImpl = /** @class */ (function () {
    function CarpoolServiceImpl(connection) {
        this.connection = connection;
        this.carpoolController = new controllers_1.CarpoolController(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
        this.eventService = new event_service_impl_1.EventServiceImpl(this.connection);
    }
    /**
     * Récupération de l'id de carpool maximum existant
     */
    CarpoolServiceImpl.prototype.getMaxCarpoolId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.carpoolController.getMaxCarpoolId()];
            });
        });
    };
    /**
     * Récupération d'un covoiturage depuis son :
     * @param carpoolId
     */
    CarpoolServiceImpl.prototype.getCarpoolById = function (carpoolId) {
        return this.carpoolController.getCarpoolById(carpoolId);
    };
    /**
     * Création d'un carpool
     * @param options
     */
    CarpoolServiceImpl.prototype.createCarpool = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var event, conductor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventService.getEventById(options.eventId)];
                    case 1:
                        event = _a.sent();
                        if (event instanceof models_1.LogError)
                            return [2 /*return*/, event];
                        return [4 /*yield*/, this.userService.getUserByMail(options.conductorId)];
                    case 2:
                        conductor = _a.sent();
                        if (conductor instanceof models_1.LogError)
                            return [2 /*return*/, conductor];
                        return [2 /*return*/, this.carpoolController.createCarpool(options)];
                }
            });
        });
    };
    /**
     * suppression d'un covoiturage selon son id
     * @param carpoolId
     */
    CarpoolServiceImpl.prototype.deleteCarpoolById = function (carpoolId) {
        return __awaiter(this, void 0, void 0, function () {
            var carpool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCarpoolById(carpoolId)];
                    case 1:
                        carpool = _a.sent();
                        if (carpool instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [2 /*return*/, this.carpoolController.deleteCarpoolsById(carpoolId)];
                }
            });
        });
    };
    /**
     * Modification des informations d'un covoiturage renseignées dans les options
     * @param options
     */
    CarpoolServiceImpl.prototype.updateCarpool = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.carpoolController.updateCarpool(options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * s'inscrire à un covoiturage
     * @param carpoolId
     * @param userMail
     */
    CarpoolServiceImpl.prototype.registerCarpool = function (carpoolId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var carpool, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCarpoolById(carpoolId)];
                    case 1:
                        carpool = _a.sent();
                        if (carpool instanceof models_1.LogError)
                            return [2 /*return*/, carpool];
                        return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.carpoolController.registerCarpool(carpoolId, userMail)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * se désinscrire d'un covoiturage
     * @param carpoolId
     * @param userMail
     */
    CarpoolServiceImpl.prototype.unregisterCarpool = function (carpoolId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var carpool, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCarpoolById(carpoolId)];
                    case 1:
                        carpool = _a.sent();
                        if (carpool instanceof models_1.LogError)
                            return [2 /*return*/, carpool];
                        return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.carpoolController.unregisterCarpool(carpoolId, userMail)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les covoiturages d'un événement
     * @param eventId
     */
    CarpoolServiceImpl.prototype.getCarpoolsByEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eventService.getEventById(eventId)];
                    case 1:
                        event = _a.sent();
                        if (event instanceof models_1.LogError)
                            return [2 /*return*/, event];
                        return [4 /*yield*/, this.carpoolController.getCarpoolsByEvent(eventId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les membres d'un covoiturage
     * @param carpoolId
     */
    CarpoolServiceImpl.prototype.getCarpoolMembersById = function (carpoolId) {
        return __awaiter(this, void 0, void 0, function () {
            var carpool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCarpoolById(carpoolId)];
                    case 1:
                        carpool = _a.sent();
                        if (carpool instanceof models_1.LogError)
                            return [2 /*return*/, carpool];
                        return [4 /*yield*/, this.carpoolController.getCarpoolMembersById(carpoolId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * récupérer les anciennes adresses de covoiturage d'un utilisateur
     * @param userMail
     */
    CarpoolServiceImpl.prototype.getOldAdressesCarpoolByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.carpoolController.getOldAdressesCarpoolByUser(userMail)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CarpoolServiceImpl;
}());
exports.CarpoolServiceImpl = CarpoolServiceImpl;
