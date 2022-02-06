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
exports.ticketRouter = void 0;
var express_1 = __importDefault(require("express"));
var database_1 = require("../database/database");
var auth_middleware_1 = require("../middlewares/auth-middleware");
var Utils_1 = require("../Utils");
var impl_1 = require("../services/impl");
var models_1 = require("../models");
var ticketRouter = express_1.default.Router();
exports.ticketRouter = ticketRouter;
/**
 * ajout d'un ticket
 * URL : /ticket/add
 * Requete : POST
 * ACCES : TOUT LE MONDe
 * Nécessite d'être connecté : NON
 */
ticketRouter.post("/add", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, id, name_1, description, closingDate, statusId, priorityId, creator, creationDate, ticket, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 1:
                    connection = _a.sent();
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    return [4 /*yield*/, ticketService.getMaxTicketId()];
                case 2:
                    id = (_a.sent()) + 1;
                    name_1 = req.body.name;
                    description = req.body.description ? req.body.description : null;
                    closingDate = req.body.closingDate ? req.body.closingDate : null;
                    statusId = req.body.statusId ? req.body.statusId : 1;
                    priorityId = req.body.priorityId ? req.body.priorityId : 1;
                    creator = (req.body.creator && req.body.creator !== "") ? req.body.creator : "no_user";
                    if (name_1 === undefined || description === undefined ||
                        closingDate === undefined || statusId === undefined || priorityId === undefined || creator === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    creationDate = Utils_1.DateUtils.getCurrentDate();
                    return [4 /*yield*/, ticketService.createTicket({
                            ticketId: id,
                            ticketName: name_1,
                            ticketDescription: description,
                            ticketCreationDate: creationDate,
                            ticketClosingDate: closingDate,
                            statusId: statusId,
                            priorityId: priorityId,
                            creatorId: creator
                        })];
                case 3:
                    ticket = _a.sent();
                    if (ticket instanceof models_1.LogError) {
                        models_1.LogError.HandleStatus(res, ticket);
                    }
                    else {
                        res.status(201);
                        res.json(ticket);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération de tous les tickets
 * URL : /ticket?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, limit, offset, tickets, err_2;
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
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    return [4 /*yield*/, ticketService.getAllTickets({
                            limit: limit,
                            offset: offset
                        })];
                case 3:
                    tickets = _a.sent();
                    res.json(tickets);
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
 * récupération de tickets selon leur statut
 * URL : /ticket/getByStatus?status={x}
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/getByStatus", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, status_1, tickets, err_3;
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
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    status_1 = req.query.status;
                    if (status_1 === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, ticketService.getTicketsByStatus(status_1)];
                case 3:
                    tickets = _a.sent();
                    res.json(tickets);
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
 * récupération d'un ticket selon son id
 * URL : /ticket/get/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, id, ticket, err_4;
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
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, ticketService.getTicketById(Number.parseInt(id))];
                case 3:
                    ticket = _a.sent();
                    if (ticket instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, ticket);
                    else
                        res.json(ticket);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_4 = _a.sent();
                    next(err_4);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération des membres d'un ticket
 * URL : /ticket/getMembers/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/getMembers/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, id, members, err_5;
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
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, ticketService.getMembersByTicketId(Number.parseInt(id))];
                case 3:
                    members = _a.sent();
                    res.json(members);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_5 = _a.sent();
                    next(err_5);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * modification d'un ticket selon son id
 * URL : /ticket/update/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, name_2, description, priorityId, connection, ticketService, ticket, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    id = req.params.id;
                    name_2 = req.body.name;
                    description = req.body.description;
                    priorityId = req.body.priorityId;
                    if (id === undefined || (name_2 === undefined && description === undefined && priorityId === undefined)) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    return [4 /*yield*/, ticketService.updateTicket({
                            ticketId: Number.parseInt(id),
                            ticketName: name_2,
                            ticketDescription: description,
                            priorityId: priorityId
                        })];
                case 3:
                    ticket = _a.sent();
                    if (ticket instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, ticket);
                    else
                        res.json(ticket);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_6 = _a.sent();
                    next(err_6);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * (ré)ouverture d'un ticket selon son id
 * URL : /ticket/open/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/open/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, connection, ticketService, ticket, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    return [4 /*yield*/, ticketService.openTicket(Number.parseInt(id))];
                case 3:
                    ticket = _a.sent();
                    if (ticket instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, ticket);
                    else
                        res.json(ticket);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_7 = _a.sent();
                    next(err_7);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * fermeture d'un ticket selon son id
 * URL : /ticket/close/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/close/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, connection, ticketService, ticket, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    return [4 /*yield*/, ticketService.closeTicket(Number.parseInt(id))];
                case 3:
                    ticket = _a.sent();
                    if (ticket instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, ticket);
                    else
                        res.json(ticket);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_8 = _a.sent();
                    next(err_8);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * archivage d'un ticket selon son id
 * URL : /ticket/archive/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.put("/archive/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, connection, ticketService, ticket, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    return [4 /*yield*/, ticketService.archiveTicket(Number.parseInt(id))];
                case 3:
                    ticket = _a.sent();
                    if (ticket instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, ticket);
                    else
                        res.json(ticket);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_9 = _a.sent();
                    next(err_9);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * suppression d'un ticket selon son id
 * URL : /ticket/delete/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, id, success, err_10;
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
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, ticketService.deleteTicketById(Number.parseInt(id))];
                case 3:
                    success = _a.sent();
                    if (success)
                        res.status(204).end();
                    else
                        res.status(404).end();
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_10 = _a.sent();
                    next(err_10);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * recherche d'un ticket via mot clé parmi tous les champs des tickets
 * URL : /ticket/search
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.get("/search", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, search, tickets, err_11;
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
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    search = req.body.search;
                    if (search === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, ticketService.searchTickets(search)];
                case 3:
                    tickets = _a.sent();
                    if (tickets instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, tickets);
                    else
                        res.json(tickets);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_11 = _a.sent();
                    next(err_11);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * assignation d'un développeur à un ticket
 * URL : /ticket/assign?ticketId={x}&userMail={x}
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.post("/assign", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, ticketId, userMail, assignation, err_12;
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
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    ticketId = req.body.ticketId;
                    userMail = req.body.userMail;
                    if (ticketId === undefined || userMail === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, ticketService.assignUserToTicket(Number.parseInt(ticketId), userMail)];
                case 3:
                    assignation = _a.sent();
                    if (assignation instanceof models_1.LogError) {
                        models_1.LogError.HandleStatus(res, assignation);
                    }
                    else {
                        res.status(201);
                        res.json(assignation);
                    }
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_12 = _a.sent();
                    next(err_12);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * désassignation d'un développeur à un ticket
 * URL : /ticket/unassign?ticketId={x}&userMail={x}
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
ticketRouter.delete("/unassign", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, ticketService, ticketId, userMail, success, err_13;
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
                    ticketService = new impl_1.TicketServiceImpl(connection);
                    ticketId = req.query.ticketId;
                    userMail = req.query.userMail;
                    if (ticketId === undefined || userMail === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, ticketService.unassignUserToTicket(Number.parseInt(ticketId), userMail)];
                case 3:
                    success = _a.sent();
                    if (success)
                        res.status(204).end();
                    else
                        res.status(404).end();
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_13 = _a.sent();
                    next(err_13);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
