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
exports.isBlockedUserConnected = exports.isAdministratorConnected = exports.isDevConnected = exports.isTokenExpired = exports.getUserMailConnected = exports.getAuthorizedToken = void 0;
var database_1 = require("../database/database");
var controllers_1 = require("../controllers");
var models_1 = require("../models");
var DateUtils_1 = require("./DateUtils");
var consts_1 = require("../consts");
/**
 * Récupération du token autorisé/connecté
 * @param req
 */
function getAuthorizedToken(req) {
    var auth = req.headers['authorization'];
    if (auth !== undefined) {
        //récupération du token autorisé
        return auth.slice(7);
    }
    return "";
}
exports.getAuthorizedToken = getAuthorizedToken;
/**
 * récupération du mail de l'utilisateur connecté
 * @param req
 */
function getUserMailConnected(req) {
    return __awaiter(this, void 0, void 0, function () {
        var token, connection, sessionController, session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = getAuthorizedToken(req);
                    if (!(token !== "")) return [3 /*break*/, 3];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    sessionController = new controllers_1.SessionController(connection);
                    return [4 /*yield*/, sessionController.getSessionByToken(token)];
                case 2:
                    session = _a.sent();
                    if (session instanceof models_1.LogError)
                        return [2 /*return*/, session];
                    return [2 /*return*/, session.userId];
                case 3: return [2 /*return*/, new models_1.LogError({ numError: 404, text: "User id not found" })];
            }
        });
    });
}
exports.getUserMailConnected = getUserMailConnected;
/**
 * Vrai s'il le token à dépassé le nombre d'heure autorisées
 * @param session
 * @param hours
 * @constructor
 */
function isTokenExpired(session, hours) {
    var actualDate = new Date();
    DateUtils_1.DateUtils.addXHoursToDate(session.updatedAt, hours);
    return actualDate > session.updatedAt;
}
exports.isTokenExpired = isTokenExpired;
/**
 * Le token renseigné correspond à un DEVELOPPEUR
 * @param req
 */
function isDevConnected(req) {
    return __awaiter(this, void 0, void 0, function () {
        var token, connection, sessionController, userController, session, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = getAuthorizedToken(req);
                    if (!(token !== "")) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    sessionController = new controllers_1.SessionController(connection);
                    userController = new controllers_1.UserController(connection);
                    return [4 /*yield*/, sessionController.getSessionByToken(token)];
                case 2:
                    session = _a.sent();
                    if (session instanceof models_1.LogError)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, userController.getUserByMail(session.userId)];
                case 3:
                    user = _a.sent();
                    if (user instanceof models_1.LogError)
                        return [2 /*return*/, false];
                    if (user.typeId === consts_1.DEV_USER_TYPE_ID) {
                        return [2 /*return*/, true];
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/, false];
            }
        });
    });
}
exports.isDevConnected = isDevConnected;
/**
 * Le token renseigné correspond à un ADMINISTRATEUR ou SUPER ADMINISTRATEUR ou DEVELOPPEUR
 * @param req
 */
function isAdministratorConnected(req) {
    return __awaiter(this, void 0, void 0, function () {
        var token, connection, sessionController, userController, session, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = getAuthorizedToken(req);
                    if (!(token !== "")) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    sessionController = new controllers_1.SessionController(connection);
                    userController = new controllers_1.UserController(connection);
                    return [4 /*yield*/, sessionController.getSessionByToken(token)];
                case 2:
                    session = _a.sent();
                    if (session instanceof models_1.LogError)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, userController.getUserByMail(session.userId)];
                case 3:
                    user = _a.sent();
                    if (user instanceof models_1.LogError)
                        return [2 /*return*/, false];
                    if (user.typeId === consts_1.DEV_USER_TYPE_ID || user.typeId === consts_1.SUPER_ADMIN_USER_TYPE_ID
                        || user.typeId === consts_1.ADMIN_USER_TYPE_ID) {
                        return [2 /*return*/, true];
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/, false];
            }
        });
    });
}
exports.isAdministratorConnected = isAdministratorConnected;
/**
 * Le token renseigné correspond à un UTILISATEUR BLOQUE
 * @param req
 */
function isBlockedUserConnected(req) {
    return __awaiter(this, void 0, void 0, function () {
        var token, connection, sessionController, userController, session, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = getAuthorizedToken(req);
                    if (!(token !== "")) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    sessionController = new controllers_1.SessionController(connection);
                    userController = new controllers_1.UserController(connection);
                    return [4 /*yield*/, sessionController.getSessionByToken(token)];
                case 2:
                    session = _a.sent();
                    if (session instanceof models_1.LogError)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, userController.getUserByMail(session.userId)];
                case 3:
                    user = _a.sent();
                    if (user instanceof models_1.LogError)
                        return [2 /*return*/, false];
                    if (user.typeId === consts_1.BLOCKED_USER_USER_TYPE_ID) {
                        return [2 /*return*/, true];
                    }
                    _a.label = 4;
                case 4: return [2 /*return*/, false];
            }
        });
    });
}
exports.isBlockedUserConnected = isBlockedUserConnected;
