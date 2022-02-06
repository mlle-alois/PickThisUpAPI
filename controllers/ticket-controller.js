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
exports.TicketController = void 0;
var models_1 = require("../models");
var user_controller_1 = require("./user-controller");
var TicketController = /** @class */ (function () {
    function TicketController(connection) {
        this.connection = connection;
    }
    TicketController.prototype.getAllTickets = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
                        offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
                        return [4 /*yield*/, this.connection.query("SELECT ticket_id,\n                                                        ticket_name,\n                                                        ticket_description,\n                                                        ticket_creation_date,\n                                                        ticket_closing_date,\n                                                        STATUS.status_id,\n                                                        status_libelle,\n                                                        priority_id,\n                                                        creator_id\n                                                 FROM TICKET\n                                                          JOIN STATUS ON TICKET.status_id = STATUS.status_id LIMIT ?, ?", [
                                offset, limit
                            ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.TicketModel({
                                        ticketId: row["ticket_id"],
                                        ticketName: row["ticket_name"],
                                        ticketDescription: row["ticket_description"],
                                        ticketCreationDate: row["ticket_creation_date"],
                                        ticketClosingDate: row["ticket_closing_date"],
                                        statusId: row["status_id"],
                                        statusLibelle: row["status_libelle"],
                                        priorityId: row["priority_id"],
                                        creatorId: row["creator_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    TicketController.prototype.getTicketsByStatusId = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT ticket_id,\n                                                        ticket_name,\n                                                        ticket_description,\n                                                        ticket_creation_date,\n                                                        ticket_closing_date,\n                                                        STATUS.status_id,\n                                                        status_libelle,\n                                                        priority_id,\n                                                        creator_id\n                                                 FROM TICKET\n                                                          JOIN STATUS ON TICKET.status_id = STATUS.status_id\n                                                 WHERE TICKET.status_id = ?", [
                            id
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.TicketModel({
                                        ticketId: row["ticket_id"],
                                        ticketName: row["ticket_name"],
                                        ticketDescription: row["ticket_description"],
                                        ticketCreationDate: row["ticket_creation_date"],
                                        ticketClosingDate: row["ticket_deadline"],
                                        statusId: row["status_id"],
                                        statusLibelle: row["status_libelle"],
                                        priorityId: row["priority_id"],
                                        creatorId: row["creator_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    TicketController.prototype.getTicketById = function (ticketId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT ticket_id,\n                                                        ticket_name,\n                                                        ticket_description,\n                                                        ticket_creation_date,\n                                                        ticket_closing_date,\n                                                        STATUS.status_id,\n                                                        status_libelle,\n                                                        priority_id,\n                                                        creator_id\n                                                 FROM TICKET\n                                                          JOIN STATUS ON TICKET.status_id = STATUS.status_id\n                                                 where TICKET.ticket_id = ?", [
                            ticketId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.TicketModel({
                                        ticketId: row["ticket_id"],
                                        ticketName: row["ticket_name"],
                                        ticketDescription: row["ticket_description"],
                                        ticketCreationDate: row["ticket_creation_date"],
                                        ticketClosingDate: row["ticket_deadline"],
                                        statusId: row["status_id"],
                                        statusLibelle: row["status_libelle"],
                                        priorityId: row["priority_id"],
                                        creatorId: row["creator_id"]
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "Ticket not found" })];
                }
            });
        });
    };
    TicketController.prototype.getMaxTicketId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query('SELECT MAX(ticket_id) as maxId FROM TICKET')];
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
    TicketController.prototype.createTicket = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO TICKET (ticket_id,\n                                                               ticket_name,\n                                                               ticket_description,\n                                                               ticket_creation_date,\n                                                               ticket_closing_date,\n                                                               status_id,\n                                                               priority_id,\n                                                               creator_id)\n                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                                options.ticketId,
                                options.ticketName,
                                options.ticketDescription,
                                options.ticketCreationDate,
                                options.ticketClosingDate,
                                options.statusId,
                                options.priorityId,
                                options.creatorId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTicketById(options.ticketId)];
                    case 2: 
                    //récupération de la ticket créée ou null si cela n'a pas fonctionné
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during ticket creation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TicketController.prototype.deleteTicketsById = function (ticketId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM TICKET\n                                                     WHERE ticket_id = ?", [
                                ticketId
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
    TicketController.prototype.updateTicket = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, params, res, headers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = [];
                        params = [];
                        //création des contenus de la requête dynamiquement
                        if (options.ticketName !== undefined) {
                            setClause.push("ticket_name = ?");
                            params.push(options.ticketName);
                        }
                        if (options.ticketDescription !== undefined) {
                            setClause.push("ticket_description = ?");
                            params.push(options.ticketDescription);
                        }
                        if (options.priorityId !== undefined) {
                            setClause.push("priority_id = ?");
                            params.push(options.priorityId);
                        }
                        params.push(options.ticketId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("UPDATE TICKET SET ".concat(setClause.join(", "), " WHERE ticket_id = ?"), params)];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getTicketById(options.ticketId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The ticket update failed" })];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The ticket update failed" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TicketController.prototype.searchTicket = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT ticket_id,\n                                                        ticket_name,\n                                                        ticket_description,\n                                                        ticket_creation_date,\n                                                        ticket_closing_date,\n                                                        TICKET.status_id,\n                                                        TICKET.priority_id,\n                                                        creator_id\n                                                 FROM TICKET\n                                                          JOIN ".concat(user_controller_1.UserController.userTable, " ON ").concat(user_controller_1.UserController.userTable, ".user_mail = TICKET.creator_id\n                                                          JOIN STATUS ON STATUS.status_id = TICKET.status_id\n                                                          JOIN PRIORITY ON PRIORITY.priority_id = TICKET.priority_id\n                                                 WHERE ticket_id LIKE '%").concat(search, "%'\n                                                    OR ticket_name LIKE '%").concat(search, "%'\n                                                    OR ticket_description LIKE '%").concat(search, "%'\n                                                    OR ticket_creation_date LIKE '%").concat(search, "%'\n                                                    OR ticket_closing_date LIKE '%").concat(search, "%'\n                                                    OR user_name LIKE '%").concat(search, "%'\n                                                    OR user_firstname LIKE '%").concat(search, "%'\n                                                    OR status_libelle LIKE '%").concat(search, "%'\n                                                    OR priority_libelle LIKE '%").concat(search, "%'"))];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.TicketModel({
                                        ticketId: row["ticket_id"],
                                        ticketName: row["ticket_name"],
                                        ticketDescription: row["ticket_description"],
                                        ticketCreationDate: row["ticket_creation_date"],
                                        ticketClosingDate: row["ticket_deadline"],
                                        statusId: row["status_id"],
                                        priorityId: row["priority_id"],
                                        creatorId: row["creator_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "No result" })];
                }
            });
        });
    };
    TicketController.prototype.getMembersByTicketId = function (ticketId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        user_type_id\n                                                 FROM ".concat(user_controller_1.UserController.userTable, "\n                                                          JOIN PARTICIPATE_USER_TICKET\n                                                               ON PARTICIPATE_USER_TICKET.user_id = ").concat(user_controller_1.UserController.userTable, ".user_mail\n                                                 where ticket_id = ?"), [
                            ticketId
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
    TicketController.prototype.openTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.execute("UPDATE TICKET\n                                                       SET status_id           = 1,\n                                                           ticket_closing_date = null\n                                                       WHERE ticket_id = ?", [
                                id
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getTicketById(id)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "Ticket opening failed" })];
                    case 2:
                        err_4 = _a.sent();
                        console.error(err_4);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "Ticket opening failed" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketController.prototype.closeTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.execute("UPDATE TICKET\n                                                       SET status_id           = 2,\n                                                           ticket_closing_date = NOW()\n                                                       WHERE ticket_id = ?", [
                                id
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getTicketById(id)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "Ticket closure failed" })];
                    case 2:
                        err_5 = _a.sent();
                        console.error(err_5);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "Ticket closure failed" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketController.prototype.archiveTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.execute("UPDATE TICKET\n                                                       SET status_id           = 3,\n                                                           ticket_closing_date = NOW()\n                                                       WHERE ticket_id = ?", [
                                id
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getTicketById(id)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "Ticket archive failed" })];
                    case 2:
                        err_6 = _a.sent();
                        console.error(err_6);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "Ticket archive failed" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketController.prototype.assignUserToTicket = function (ticketId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO PARTICIPATE_USER_TICKET (user_id, ticket_id)\n                                           VALUES (?, ?)", [
                                userMail, ticketId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTicketById(ticketId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_7 = _a.sent();
                        console.error(err_7);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during assignation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TicketController.prototype.unassignUserToTicket = function (ticketId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.execute("DELETE\n                                           FROM PARTICIPATE_USER_TICKET\n                                           WHERE ticket_id = ?\n                                             AND user_id = ?", [
                                ticketId, userMail
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 2:
                        err_8 = _a.sent();
                        console.error(err_8);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TicketController;
}());
exports.TicketController = TicketController;
