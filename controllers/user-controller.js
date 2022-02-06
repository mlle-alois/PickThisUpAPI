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
exports.UserController = void 0;
var models_1 = require("../models");
var bcrypt_1 = require("bcrypt");
var UserController = /** @class */ (function () {
    function UserController(connection) {
        this.connection = connection;
    }
    /**
     * Récupération de tous les utilisateurs
     * @param options -> Limit et offset de la requete
     */
    UserController.prototype.getAllUsers = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
                        offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
                        return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        media_path,\n                                                        USER_TYPE.user_type_id,\n                                                        user_type_libelle\n                                                 FROM ".concat(UserController.userTable, "\n                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ").concat(UserController.userTable, ".profile_picture_id\n                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ").concat(UserController.userTable, ".user_type_id LIMIT ?, ?"), [
                                offset,
                                limit
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
                                        profilePicture: new models_1.MediaModel({
                                            mediaId: row["profile_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        typeId: row["user_type_id"],
                                        type: new models_1.UserTypeModel({
                                            userTypeId: row["user_type_id"],
                                            userTypeLibelle: row["user_type_libelle"]
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
     * Récupération d'un utilisateur depuis son :
     * @param mail
     */
    UserController.prototype.getUserByMail = function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        media_path,\n                                                        USER_TYPE.user_type_id,\n                                                        user_type_libelle\n                                                 FROM ".concat(UserController.userTable, "\n                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ").concat(UserController.userTable, ".profile_picture_id\n                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ").concat(UserController.userTable, ".user_type_id\n                                                 where user_mail = ?"), [
                            mail
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.UserModel({
                                        mail: row["user_mail"],
                                        password: row["user_password"],
                                        firstname: row["user_firstname"],
                                        name: row["user_name"],
                                        phoneNumber: row["user_phone_number"],
                                        profilePictureId: row["profile_picture_id"],
                                        profilePicture: new models_1.MediaModel({
                                            mediaId: row["profile_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        typeId: row["user_type_id"],
                                        type: new models_1.UserTypeModel({
                                            userTypeId: row["user_type_id"],
                                            userTypeLibelle: row["user_type_libelle"]
                                        })
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "User not found" })];
                }
            });
        });
    };
    /**
     * Récupération d'un utilisateur via :
     * @param mail
     * @param password -> non haché
     */
    UserController.prototype.getUserByMailAndPassword = function (mail, password) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row, isSamePassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        media_path,\n                                                        USER_TYPE.user_type_id,\n                                                        user_type_libelle\n                                                 FROM ".concat(UserController.userTable, "\n                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ").concat(UserController.userTable, ".profile_picture_id\n                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ").concat(UserController.userTable, ".user_type_id\n                                                 where user_mail = ?"), [
                            mail
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (!Array.isArray(data)) return [3 /*break*/, 3];
                        rows = data;
                        if (!(rows.length > 0)) return [3 /*break*/, 3];
                        row = rows[0];
                        return [4 /*yield*/, (0, bcrypt_1.compare)(password, row["user_password"])];
                    case 2:
                        isSamePassword = _a.sent();
                        if (!isSamePassword) {
                            return [2 /*return*/, new models_1.LogError({ numError: 409, text: "Incorrect mail or password" })];
                        }
                        return [2 /*return*/, new models_1.UserModel({
                                mail: row["user_mail"],
                                password: row["user_password"],
                                firstname: row["user_firstname"],
                                name: row["user_name"],
                                phoneNumber: row["user_phone_number"],
                                profilePictureId: row["profile_picture_id"],
                                profilePicture: new models_1.MediaModel({
                                    mediaId: row["profile_picture_id"],
                                    mediaPath: row["media_path"]
                                }),
                                typeId: row["user_type_id"],
                                type: new models_1.UserTypeModel({
                                    userTypeId: row["user_type_id"],
                                    userTypeLibelle: row["user_type_libelle"]
                                })
                            })];
                    case 3: return [2 /*return*/, new models_1.LogError({ numError: 404, text: "User nor found" })];
                }
            });
        });
    };
    /**
     * récupération de tous les développeurs
     * @param options
     */
    UserController.prototype.getAllDevelopers = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
                        offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
                        return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        media_path,\n                                                        USER_TYPE.user_type_id,\n                                                        user_type_libelle\n                                                 FROM ".concat(UserController.userTable, "\n                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ").concat(UserController.userTable, ".profile_picture_id\n                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ").concat(UserController.userTable, ".user_type_id\n                                                 WHERE ").concat(UserController.userTable, ".user_type_id = 1 LIMIT ?, ?"), [
                                offset, limit
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
                                        profilePicture: new models_1.MediaModel({
                                            mediaId: row["profile_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        typeId: row["user_type_id"],
                                        type: new models_1.UserTypeModel({
                                            userTypeId: row["user_type_id"],
                                            userTypeLibelle: row["user_type_libelle"]
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
     * Récupération d'un utilisateur depuis son :
     * @param token
     */
    UserController.prototype.getUserByToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        media_path,\n                                                        USER_TYPE.user_type_id,\n                                                        user_type_libelle\n                                                 FROM ".concat(UserController.userTable, "\n                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ").concat(UserController.userTable, ".profile_picture_id\n                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ").concat(UserController.userTable, ".user_type_id\n                                                          JOIN SESSION on SESSION.user_id = ").concat(UserController.userTable, ".user_mail\n                                                 where token = ?"), [
                            token
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.UserModel({
                                        mail: row["user_mail"],
                                        password: row["user_password"],
                                        firstname: row["user_firstname"],
                                        name: row["user_name"],
                                        phoneNumber: row["user_phone_number"],
                                        profilePictureId: row["profile_picture_id"],
                                        profilePicture: new models_1.MediaModel({
                                            mediaId: row["profile_picture_id"],
                                            mediaPath: row["media_path"]
                                        }),
                                        typeId: row["user_type_id"],
                                        type: new models_1.UserTypeModel({
                                            userTypeId: row["user_type_id"],
                                            userTypeLibelle: row["user_type_libelle"]
                                        })
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "User not found" })];
                }
            });
        });
    };
    /**
     * Modification des informations d'un utilisateur renseignées dans les options
     * @param options -> informations à modifier
     */
    UserController.prototype.updateUser = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, params, hachedPassword, res, headers, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = [];
                        params = [];
                        if (options.password === "") {
                            options.password = undefined;
                        }
                        if (!(options.password !== undefined)) return [3 /*break*/, 2];
                        setClause.push("user_password = ?");
                        return [4 /*yield*/, (0, bcrypt_1.hash)(options.password, 5)];
                    case 1:
                        hachedPassword = _a.sent();
                        params.push(hachedPassword);
                        _a.label = 2;
                    case 2:
                        if (options.name !== undefined) {
                            setClause.push("user_name = ?");
                            params.push(options.name);
                        }
                        if (options.firstname !== undefined) {
                            setClause.push("user_firstname = ?");
                            params.push(options.firstname);
                        }
                        if (options.phoneNumber !== undefined) {
                            setClause.push("user_phone_number = ?");
                            params.push(options.phoneNumber);
                        }
                        if (options.typeId !== undefined) {
                            setClause.push("user_type_id = ?");
                            params.push(options.typeId);
                        }
                        params.push(options.mail);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.connection.execute("UPDATE ".concat(UserController.userTable, " SET ").concat(setClause.join(", "), " WHERE user_mail = ?"), params)];
                    case 4:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getUserByMail(options.mail)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The user update failed" })];
                    case 5:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The user update failed" })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Modification du statut d'un utilisateur renseignées dans les paramètres
     * @param mail
     * @param status
     */
    UserController.prototype.updateUserStatus = function (mail, status) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, params, res, headers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = [];
                        params = [];
                        if (status !== undefined) {
                            setClause.push("status = ?");
                            params.push(status);
                        }
                        params.push(mail);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("UPDATE ".concat(UserController.userTable, " SET ").concat(setClause.join(", "), " WHERE user_mail = ?"), params)];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getUserByMail(mail)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The user update failed" })];
                    case 3:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The user update failed" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Suppression d'un utilisateur depuis son :
     * @param userId
     */
    UserController.prototype.deleteUserByMail = function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE FROM ".concat(UserController.userTable, " WHERE user_mail = \"").concat(mail, "\""))];
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
    UserController.userTable = "my_user";
    return UserController;
}());
exports.UserController = UserController;
