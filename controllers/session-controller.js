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
exports.SessionController = void 0;
var user_controller_1 = require("./user-controller");
var models_1 = require("../models");
var SessionController = /** @class */ (function () {
    function SessionController(connection) {
        this.connection = connection;
        this.userController = new user_controller_1.UserController(this.connection);
    }
    /**
     * Récupération de l'id de session maximum existant
     */
    SessionController.prototype.getMaxSessionId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query('SELECT MAX(session_id) as maxId FROM SESSION')];
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
    /**
     * Récupération d'une session depuis le token
     * @param token
     */
    SessionController.prototype.getSessionByToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT session_id, token, createdAt, updatedAt, deletedAt, user_id\n                                                 FROM SESSION\n                                                 where token = ? ", [
                            token
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.SessionModel({
                                        sessionId: Number.parseInt(row["session_id"]),
                                        token: row["token"],
                                        createdAt: row["createdAt"],
                                        updatedAt: row["updatedAt"],
                                        deletedAt: row["deletedAt"],
                                        userId: row["user_id"]
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 403, text: "Session not found, access denied" })];
                }
            });
        });
    };
    /**
     * Création d'une session
     * @param sessionId
     * @param token
     * @param mail
     */
    SessionController.prototype.createSession = function (sessionId, token, mail) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        //création de la session
                        return [4 /*yield*/, this.connection.execute("INSERT INTO SESSION (session_id, token, createdAt, updatedAt, user_id)\n                                           VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)", [
                                //incrémentation manuelle
                                sessionId,
                                token,
                                mail
                            ])];
                    case 1:
                        //création de la session
                        _a.sent();
                        return [4 /*yield*/, this.getSessionByToken(token)];
                    case 2: 
                    //récupération de la session créée ou null si cela n'a pas fonctionné
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during session creation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * récupérations des sessions associées à l'user mail
     * @param mail
     */
    SessionController.prototype.deleteOldSessionsByUserMail = function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM SESSION\n                                                     WHERE user_id = ?", [
                                mail
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
    /**
     * Suppression d'une session depuis le token
     * @param token
     */
    SessionController.prototype.deleteSessionByToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM SESSION\n                                                     WHERE token = ?", [
                                token
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 2:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Récupération d'une session en ajoutant 2 heure depuis le token
     * A utiliser si on veut effectuer le controle d'expiration du token en base
     * @param token
     */
    SessionController.prototype.getLastUpdatedTimePlus2Hours = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT (updatedAt + INTERVAL '2' HOUR) as updatedAt\n                                                 FROM SESSION\n                                                 where token = ? ", [
                            token
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, row["updatedAt"]];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Met à jour le champ updatedAt de la dernière session
     * @param options
     */
    SessionController.prototype.updateHourOfSession = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var actualDate, res, headers, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        actualDate = new Date();
                        return [4 /*yield*/, this.connection.execute("UPDATE SESSION\n                                                       SET updatedAt = ?\n                                                       WHERE token = ?", [
                                actualDate,
                                options.token
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getSessionByToken(options.token)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The session update failed" })];
                    case 2:
                        err_4 = _a.sent();
                        console.error(err_4);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The session update failed" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SessionController;
}());
exports.SessionController = SessionController;
