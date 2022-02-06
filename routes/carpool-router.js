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
exports.carpoolRouter = void 0;
var express_1 = __importDefault(require("express"));
var database_1 = require("../database/database");
var auth_middleware_1 = require("../middlewares/auth-middleware");
var Utils_1 = require("../Utils");
var impl_1 = require("../services/impl");
var models_1 = require("../models");
var carpoolRouter = express_1.default.Router();
exports.carpoolRouter = carpoolRouter;
/**
 * ajout d'un covoiturage
 * URL : /carpool/add
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.post("/add", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, carpoolService, id, street, zipcode, city, nbPlaces, eventId, conductorId, carpool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 6];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    return [4 /*yield*/, carpoolService.getMaxCarpoolId()];
                case 3:
                    id = (_a.sent()) + 1;
                    street = req.body.street;
                    zipcode = req.body.zipcode;
                    city = req.body.city;
                    nbPlaces = req.body.nbPlaces;
                    eventId = req.body.eventId;
                    if (street === undefined || zipcode === undefined || city === undefined ||
                        nbPlaces === undefined || eventId === undefined) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 4:
                    conductorId = _a.sent();
                    if (conductorId instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, conductorId)];
                    return [4 /*yield*/, carpoolService.createCarpool({
                            carpoolId: id,
                            carpoolDepartureStreet: street,
                            carpoolDepartureZipcode: zipcode,
                            carpoolDepartureCity: city,
                            nbPlaces: nbPlaces,
                            eventId: eventId,
                            conductorId: conductorId
                        })];
                case 5:
                    carpool = _a.sent();
                    if (carpool instanceof models_1.LogError) {
                        models_1.LogError.HandleStatus(res, carpool);
                    }
                    else {
                        res.status(201);
                        res.json(carpool);
                    }
                    _a.label = 6;
                case 6:
                    res.status(403).end();
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération d'un covoiturage selon son id
 * URL : /carpool/get/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, carpoolService, id, carpool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, carpoolService.getCarpoolById(Number.parseInt(id))];
                case 2:
                    carpool = _a.sent();
                    if (carpool instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, carpool);
                    else
                        res.json(carpool);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * modification d'un covoiturage selon son id
 * URL : /carpool/update/:id
 * Requete : PUT
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, street, zipcode, city, nbPlaces, connection, carpoolService, carpool;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    id = req.params.id;
                    street = req.body.street;
                    zipcode = req.body.zipcode;
                    city = req.body.city;
                    nbPlaces = req.body.nbPlaces;
                    if (id === undefined || (street === undefined && zipcode === undefined && city === undefined && nbPlaces === undefined)) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    return [4 /*yield*/, carpoolService.updateCarpool({
                            carpoolId: Number.parseInt(id),
                            carpoolDepartureStreet: street,
                            carpoolDepartureZipcode: zipcode,
                            carpoolDepartureCity: city,
                            nbPlaces: nbPlaces
                        })];
                case 3:
                    carpool = _a.sent();
                    if (carpool instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, carpool);
                    else
                        res.json(carpool);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * suppression d'un covoiturage selon son id
 * URL : /carpool/delete/:id
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, carpoolService, id, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, Utils_1.isBlockedUserConnected)(req)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, carpoolService.deleteCarpoolById(Number.parseInt(id))];
                case 3:
                    success = _a.sent();
                    if (success)
                        res.json(success);
                    else
                        res.status(404).end();
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * s'inscrire à un covoiturage selon son id
 * URL : /carpool/register/:id
 * Requete : POST
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.post("/register/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, carpoolService, id, userMail, participants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    userMail = _a.sent();
                    if (userMail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, userMail)];
                    return [4 /*yield*/, carpoolService.registerCarpool(Number.parseInt(id), userMail)];
                case 3:
                    participants = _a.sent();
                    if (participants instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, participants);
                    else
                        res.json(participants);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * se désinscrire d'un covoiturage selon son id
 * URL : /carpool/unregister/:id
 * Requete : DELETE
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.delete("/unregister/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, carpoolService, id, userMail, participants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    userMail = _a.sent();
                    if (userMail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, userMail)];
                    return [4 /*yield*/, carpoolService.unregisterCarpool(Number.parseInt(id), userMail)];
                case 3:
                    participants = _a.sent();
                    if (participants instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, participants);
                    else
                        res.json(participants);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les covoiturages d'un événement
 * URL : /carpool/getByEvent/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.get("/getByEvent/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, carpoolService, id, carpools;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, carpoolService.getCarpoolsByEvent(Number.parseInt(id))];
                case 2:
                    carpools = _a.sent();
                    if (carpools instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, carpools);
                    else
                        res.json(carpools);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les participants d'un covoiturage selon son id
 * URL : /carpool/getParticipants/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.get("/getParticipants/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, carpoolService, id, participants;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, carpoolService.getCarpoolMembersById(Number.parseInt(id))];
                case 2:
                    participants = _a.sent();
                    if (participants instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, participants);
                    else
                        res.json(participants);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * récupérer les précédentes adresses de covoiturages de l'utilisateur connecté
 * URL : /carpool/getOldAdresses
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.get("/getOldAdresses", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, carpoolService, mail, carpools;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    carpoolService = new impl_1.CarpoolServiceImpl(connection);
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    mail = _a.sent();
                    if (mail instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, mail)];
                    return [4 /*yield*/, carpoolService.getOldAdressesCarpoolByUser(mail)];
                case 3:
                    carpools = _a.sent();
                    if (carpools instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, carpools);
                    else
                        res.json(carpools);
                    return [2 /*return*/];
            }
        });
    });
});
