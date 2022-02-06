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
exports.TicketServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var models_1 = require("../../models");
var user_service_impl_1 = require("./user-service-impl");
var status_service_impl_1 = require("./status-service-impl");
var priority_service_impl_1 = require("./priority-service-impl");
var TicketServiceImpl = /** @class */ (function () {
    function TicketServiceImpl(connection) {
        this.connection = connection;
        this.ticketController = new controllers_1.TicketController(this.connection);
        this.statusService = new status_service_impl_1.StatusServiceImpl(this.connection);
        this.priorityService = new priority_service_impl_1.PriorityServiceImpl(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
    }
    /**
     * Récupération de tous les tickets
     * @param options -> Limit et offset de la requete
     */
    TicketServiceImpl.prototype.getAllTickets = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.ticketController.getAllTickets(options)];
            });
        });
    };
    /**
     * Récupération de tous les tickets selon un statut
     * @param status
     */
    TicketServiceImpl.prototype.getTicketsByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var st;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.statusService.getStatusByName(status)];
                    case 1:
                        st = _a.sent();
                        if (st instanceof models_1.LogError)
                            return [2 /*return*/, []];
                        return [2 /*return*/, this.ticketController.getTicketsByStatusId(st.statusId)];
                }
            });
        });
    };
    /**
     * Récupération de l'id du ticket maximum existant
     */
    TicketServiceImpl.prototype.getMaxTicketId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.ticketController.getMaxTicketId()];
            });
        });
    };
    /**
     * Récupération d'un ticket depuis son :
     * @param ticketId
     */
    TicketServiceImpl.prototype.getTicketById = function (ticketId) {
        return this.ticketController.getTicketById(ticketId);
    };
    /**
     * Création d'un ticket
     * @param options
     */
    TicketServiceImpl.prototype.createTicket = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var status_1, priority;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(options.statusId !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.statusService.getStatusById(options.statusId)];
                    case 1:
                        status_1 = _a.sent();
                        if (status_1 instanceof models_1.LogError)
                            return [2 /*return*/, status_1];
                        _a.label = 2;
                    case 2:
                        if (!(options.priorityId !== null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.priorityService.getPriorityById(options.priorityId)];
                    case 3:
                        priority = _a.sent();
                        if (priority instanceof models_1.LogError)
                            return [2 /*return*/, priority];
                        _a.label = 4;
                    case 4: 
                    /*const creator = await this.userService.getUserByMail(options.creatorId);
                    if (creator instanceof LogError)
                        return creator;*/
                    return [2 /*return*/, this.ticketController.createTicket(options)];
                }
            });
        });
    };
    /**
     * récupération des membres d'un ticket
     * @param ticketId
     */
    TicketServiceImpl.prototype.getMembersByTicketId = function (ticketId) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.getTicketById(ticketId)];
                    case 1:
                        ticket = _a.sent();
                        if (ticket instanceof models_1.LogError)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.ticketController.getMembersByTicketId(ticketId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * suppression d'un ticket selon son id
     * @param ticketId
     */
    TicketServiceImpl.prototype.deleteTicketById = function (ticketId) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.getTicketById(ticketId)];
                    case 1:
                        ticket = _a.sent();
                        if (ticket instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.ticketController.deleteTicketsById(ticketId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Modification des informations d'un ticket renseignées dans les options
     * En cas de modification de liste, la position dans la liste est modifiée à la plus élevée existante
     * @param options
     */
    TicketServiceImpl.prototype.updateTicket = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket, priority;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.getTicketById(options.ticketId)];
                    case 1:
                        ticket = _a.sent();
                        if (ticket instanceof models_1.LogError)
                            return [2 /*return*/, ticket];
                        if (!(options.priorityId !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.priorityService.getPriorityById(options.priorityId)];
                    case 2:
                        priority = _a.sent();
                        if (priority instanceof models_1.LogError)
                            return [2 /*return*/, priority];
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.ticketController.updateTicket(options)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * recherche d'un ticket via mot clé parmi tous les champs des tickets
     * @param search
     */
    TicketServiceImpl.prototype.searchTickets = function (search) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.searchTicket(search)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * (ré)ouverture d'un ticket selon son id
     * @param id
     */
    TicketServiceImpl.prototype.openTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.getTicketById(id)];
                    case 1:
                        ticket = _a.sent();
                        if (ticket instanceof models_1.LogError)
                            return [2 /*return*/, ticket];
                        return [4 /*yield*/, this.ticketController.openTicket(id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * fermeture d'un ticket selon son id
     * @param id
     */
    TicketServiceImpl.prototype.closeTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.getTicketById(id)];
                    case 1:
                        ticket = _a.sent();
                        if (ticket instanceof models_1.LogError)
                            return [2 /*return*/, ticket];
                        return [4 /*yield*/, this.ticketController.closeTicket(id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * archivage d'un ticket selon son id
     * @param id
     */
    TicketServiceImpl.prototype.archiveTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.getTicketById(id)];
                    case 1:
                        ticket = _a.sent();
                        if (ticket instanceof models_1.LogError)
                            return [2 /*return*/, ticket];
                        return [4 /*yield*/, this.ticketController.archiveTicket(id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * assigner un développeur à un ticket
     * @param ticketId
     * @param userMail
     */
    TicketServiceImpl.prototype.assignUserToTicket = function (ticketId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.getTicketById(ticketId)];
                    case 1:
                        ticket = _a.sent();
                        if (ticket instanceof models_1.LogError)
                            return [2 /*return*/, ticket];
                        return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [2 /*return*/, this.ticketController.assignUserToTicket(ticketId, userMail)];
                }
            });
        });
    };
    /**
     * désassigner un développeur à un ticket
     * @param ticketId
     * @param userMail
     */
    TicketServiceImpl.prototype.unassignUserToTicket = function (ticketId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketController.getTicketById(ticketId)];
                    case 1:
                        ticket = _a.sent();
                        if (ticket instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [2 /*return*/, this.ticketController.unassignUserToTicket(ticketId, userMail)];
                }
            });
        });
    };
    return TicketServiceImpl;
}());
exports.TicketServiceImpl = TicketServiceImpl;
