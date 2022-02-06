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
exports.userRouter = void 0;
var express_1 = __importDefault(require("express"));
var database_1 = require("../database/database");
var auth_middleware_1 = require("../middlewares/auth-middleware");
var Utils_1 = require("../Utils");
var impl_1 = require("../services/impl");
var models_1 = require("../models");
var userRouter = express_1.default.Router();
exports.userRouter = userRouter;
/**
 * récupération des développeurs
 * URL : /user/getAllDevelopers?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getAllDevelopers", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, userService, limit, offset, developers, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    userService = new impl_1.UserServiceImpl(connection);
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    return [4 /*yield*/, userService.getAllDevelopers({
                            limit: limit,
                            offset: offset
                        })];
                case 3:
                    developers = _a.sent();
                    res.json(developers);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération des développeurs
 * URL : /user/getAllUsers?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getAllUsers", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, userService, limit, offset, developers, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    userService = new impl_1.UserServiceImpl(connection);
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    return [4 /*yield*/, userService.getAllUsers({
                            limit: limit,
                            offset: offset
                        })];
                case 3:
                    developers = _a.sent();
                    res.json(developers);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    next(err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération des développeurs
 * URL : /user/getAllUsers?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getAllTypes", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, userTypeService, limit, offset, developers, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    userTypeService = new impl_1.UserTypeServiceImpl(connection);
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    return [4 /*yield*/, userTypeService.getAllUsersTypes({
                            limit: limit,
                            offset: offset
                        })];
                case 3:
                    developers = _a.sent();
                    res.json(developers);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _a.sent();
                    next(err_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération de
 * URL : /user/getUserByToken/:token
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getUserByToken/:token", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, userService, token, user, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    userService = new impl_1.UserServiceImpl(connection);
                    token = req.params.token;
                    if (token === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, userService.getUserByToken(token)];
                case 2:
                    user = _a.sent();
                    if (user instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, user);
                    else
                        res.json(user);
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    next(err_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
/**
 * modification d'un user selon son mail
 * URL : /user/update/:mail
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV ou USER CONNECTE
 * Nécessite d'être connecté : OUI
 */
userRouter.put("/update/:mail", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var mail, _a, _b, password, name_1, firstname, phone, typeId, connection, userService, user, err_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    mail = req.params.mail;
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 1:
                    _a = !(_c.sent());
                    if (!_a) return [3 /*break*/, 3];
                    _b = mail;
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 2:
                    _a = _b !== (_c.sent());
                    _c.label = 3;
                case 3:
                    if (_a)
                        return [2 /*return*/, res.status(403).end()];
                    password = req.body.password;
                    name_1 = req.body.name;
                    firstname = req.body.firstname;
                    phone = req.body.phone;
                    typeId = req.body.typeId;
                    if (mail === undefined || (password === undefined && name_1 === undefined && firstname === undefined && phone === undefined && typeId === undefined))
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 4:
                    connection = _c.sent();
                    userService = new impl_1.UserServiceImpl(connection);
                    return [4 /*yield*/, userService.updateUser({
                            mail: mail,
                            password: password,
                            name: name_1,
                            firstname: firstname,
                            phoneNumber: phone,
                            typeId: typeId
                        })];
                case 5:
                    user = _c.sent();
                    if (user instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, user);
                    else
                        res.json(user);
                    return [3 /*break*/, 7];
                case 6:
                    err_5 = _c.sent();
                    next(err_5);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
/**
 * suppression d'un user selon son mail
 * URL : /user/delete/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.delete("/delete/:mail", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, connection, userService, mail, success, err_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    _a = (_b.sent());
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, Utils_1.isAdministratorConnected)(req)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    if (!_a) return [3 /*break*/, 6];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 4:
                    connection = _b.sent();
                    userService = new impl_1.UserServiceImpl(connection);
                    mail = req.params.mail;
                    if (mail === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, userService.deleteUserByMail(mail)];
                case 5:
                    success = _b.sent();
                    if (success)
                        res.status(204).end();
                    else
                        res.status(404).end();
                    _b.label = 6;
                case 6:
                    res.status(403).end();
                    return [3 /*break*/, 8];
                case 7:
                    err_6 = _b.sent();
                    next(err_6);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
