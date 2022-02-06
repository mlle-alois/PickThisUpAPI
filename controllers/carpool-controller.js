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
exports.CarpoolController = void 0;
var models_1 = require("../models");
var user_controller_1 = require("./user-controller");
var CarpoolController = /** @class */ (function () {
    function CarpoolController(connection) {
        this.connection = connection;
    }
    CarpoolController.prototype.getCarpoolById = function (carpoolId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT carpool_id,\n                                                        carpool_departure_street,\n                                                        carpool_departure_zipcode,\n                                                        carpool_departure_city,\n                                                        nb_places,\n                                                        event_id,\n                                                        conductor_id\n                                                 FROM CARPOOL\n                                                 where carpool_id = ?", [
                            carpoolId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.CarpoolModel({
                                        carpoolId: row["carpool_id"],
                                        carpoolDepartureStreet: row["carpool_departure_street"],
                                        carpoolDepartureZipcode: row["carpool_departure_zipcode"],
                                        carpoolDepartureCity: row["carpool_departure_city"],
                                        nbPlaces: row["nb_places"],
                                        eventId: row["event_id"],
                                        conductorId: row["conductor_id"]
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "Carpool not found" })];
                }
            });
        });
    };
    CarpoolController.prototype.getMaxCarpoolId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query('SELECT MAX(carpool_id) as maxId FROM CARPOOL')];
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
    CarpoolController.prototype.createCarpool = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO CARPOOL (carpool_id,\n                                                                carpool_departure_street,\n                                                                carpool_departure_zipcode,\n                                                                carpool_departure_city,\n                                                                nb_places,\n                                                                event_id,\n                                                                conductor_id)\n                                           VALUES (?, ?, ?, ?, ?, ?, ?)", [
                                options.carpoolId,
                                options.carpoolDepartureStreet,
                                options.carpoolDepartureZipcode,
                                options.carpoolDepartureCity,
                                options.nbPlaces,
                                options.eventId,
                                options.conductorId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCarpoolById(options.carpoolId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during carpool creation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CarpoolController.prototype.deleteCarpoolsById = function (carpoolId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM CARPOOL\n                                                     WHERE carpool_id = ?", [
                                carpoolId
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
    CarpoolController.prototype.updateCarpool = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, params, res, headers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = [];
                        params = [];
                        if (options.carpoolDepartureStreet !== undefined) {
                            setClause.push("carpool_departure_street = ?");
                            params.push(options.carpoolDepartureStreet);
                        }
                        if (options.carpoolDepartureZipcode !== undefined) {
                            setClause.push("carpool_departure_zipcode = ?");
                            params.push(options.carpoolDepartureZipcode);
                        }
                        if (options.carpoolDepartureCity !== undefined) {
                            setClause.push("carpool_departure_city = ?");
                            params.push(options.carpoolDepartureCity);
                        }
                        if (options.nbPlaces !== undefined) {
                            setClause.push("nb_places = ?");
                            params.push(options.nbPlaces);
                        }
                        params.push(options.carpoolId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("UPDATE CARPOOL SET ".concat(setClause.join(", "), " WHERE carpool_id = ?"), params)];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getCarpoolById(options.carpoolId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The carpool update failed" })];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The carpool update failed" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CarpoolController.prototype.registerCarpool = function (carpoolId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO RESERVE_USER_CARPOOL (user_id, carpool_id)\n                                           VALUES (?, ?)", [
                                userMail, carpoolId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCarpoolMembersById(carpoolId)];
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
    CarpoolController.prototype.unregisterCarpool = function (carpoolId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("DELETE\n                                           FROM RESERVE_USER_CARPOOL\n                                           WHERE user_id = ?\n                                             AND carpool_id = ?", [
                                userMail, carpoolId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getCarpoolMembersById(carpoolId)];
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
    CarpoolController.prototype.getCarpoolsByEvent = function (eventId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT CARPOOL.carpool_id,\n                                                        carpool_departure_street,\n                                                        carpool_departure_zipcode,\n                                                        carpool_departure_city,\n                                                        nb_places,\n                                                        COALESCE(nb_places - COUNT(RUC.carpool_id), 0) as carpool_remaining_places,\n                                                        event_id,\n                                                        conductor_id,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number\n                                                 FROM CARPOOL\n                                                          JOIN ".concat(user_controller_1.UserController.userTable, " ON ").concat(user_controller_1.UserController.userTable, ".user_mail = CARPOOL.conductor_id\n                                                          LEFT JOIN RESERVE_USER_CARPOOL RUC ON RUC.carpool_id = CARPOOL.carpool_id\n                                                 WHERE CARPOOL.event_id = ?\n                                                 GROUP BY CARPOOL.carpool_id"), [
                            eventId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.CarpoolModel({
                                        carpoolId: row["carpool_id"],
                                        carpoolDepartureStreet: row["carpool_departure_street"],
                                        carpoolDepartureZipcode: row["carpool_departure_zipcode"],
                                        carpoolDepartureCity: row["carpool_departure_city"],
                                        nbPlaces: row["nb_places"],
                                        carpoolRemainingPlaces: row["carpool_remaining_places"],
                                        eventId: row["event_id"],
                                        conductorId: row["conductor_id"],
                                        conductor: new models_1.UserModel({
                                            mail: row["conductor_id"],
                                            password: row["user_password"],
                                            name: row["user_name"],
                                            firstname: row["user_firstname"],
                                            phoneNumber: row["user_phone_number"]
                                        })
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    CarpoolController.prototype.getCarpoolMembersById = function (carpoolId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        user_type_id\n                                                 FROM ".concat(user_controller_1.UserController.userTable, "\n                                                          JOIN RESERVE_USER_CARPOOL RUC ON RUC.user_id = ").concat(user_controller_1.UserController.userTable, ".user_mail\n                                                 WHERE carpool_id = ?"), [
                            carpoolId
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
    CarpoolController.prototype.getOldAdressesCarpoolByUser = function (userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT DISTINCT carpool_departure_street,\n                                                                 carpool_departure_zipcode,\n                                                                 carpool_departure_city\n                                                 FROM CARPOOL\n                                                 WHERE conductor_id = ?", [
                            userMail
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return {
                                        "street": row['carpool_departure_street'],
                                        "zipcode": row['carpool_departure_zipcode'],
                                        "city": row['carpool_departure_city'],
                                    };
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    return CarpoolController;
}());
exports.CarpoolController = CarpoolController;
