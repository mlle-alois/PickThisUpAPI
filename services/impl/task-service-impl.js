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
exports.TaskServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var models_1 = require("../../models");
var list_service_impl_1 = require("./list-service-impl");
var user_service_impl_1 = require("./user-service-impl");
var status_service_impl_1 = require("./status-service-impl");
var priority_service_impl_1 = require("./priority-service-impl");
var TaskServiceImpl = /** @class */ (function () {
    function TaskServiceImpl(connection) {
        this.connection = connection;
        this.taskController = new controllers_1.TaskController(this.connection);
        this.listService = new list_service_impl_1.ListServiceImpl(this.connection);
        this.statusService = new status_service_impl_1.StatusServiceImpl(this.connection);
        this.priorityService = new priority_service_impl_1.PriorityServiceImpl(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
    }
    /**
     * Récupération de toutes les tasks
     * @param options -> Limit et offset de la requete
     */
    TaskServiceImpl.prototype.getAllTasks = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.taskController.getAllTasks(options)];
            });
        });
    };
    /**
     * Récupération de l'id de task maximum existant
     */
    TaskServiceImpl.prototype.getMaxTaskId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.taskController.getMaxTaskId()];
            });
        });
    };
    /**
     * Récupération d'une task depuis son :
     * @param taskId
     */
    TaskServiceImpl.prototype.getTaskById = function (taskId) {
        return this.taskController.getTaskById(taskId);
    };
    /**
     * Création d'une task
     * @param options
     */
    TaskServiceImpl.prototype.createTask = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var priority, list, creator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(options.priorityId !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.priorityService.getPriorityById(options.priorityId)];
                    case 1:
                        priority = _a.sent();
                        if (priority instanceof models_1.LogError)
                            return [2 /*return*/, priority];
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.listService.getListById(options.listId)];
                    case 3:
                        list = _a.sent();
                        if (list instanceof models_1.LogError)
                            return [2 /*return*/, list];
                        return [4 /*yield*/, this.userService.getUserByMail(options.creatorId)];
                    case 4:
                        creator = _a.sent();
                        if (creator instanceof models_1.LogError)
                            return [2 /*return*/, creator];
                        return [2 /*return*/, this.taskController.createTask(options)];
                }
            });
        });
    };
    /**
     * récupération des membres d'une tâche
     * @param taskId
     */
    TaskServiceImpl.prototype.getMembersByTaskId = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.taskController.getTaskById(taskId)];
                    case 1:
                        task = _a.sent();
                        if (task instanceof models_1.LogError)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, this.taskController.getMembersByTaskId(taskId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * suppression d'une task selon son id
     * @param taskId
     */
    TaskServiceImpl.prototype.deleteTaskById = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.taskController.getTaskById(taskId)];
                    case 1:
                        task = _a.sent();
                        if (task instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.taskController.deleteTasksById(taskId)];
                    case 2:
                        if (!(_a.sent()))
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.reorderPositionsInListAfterDeleted(task.listId, task.positionInList)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Modification des informations d'une task renseignées dans les options
     * En cas de modification de liste, la position dans la liste est modifiée à la plus élevée existante
     * @param options
     */
    TaskServiceImpl.prototype.updateTask = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var task, status_1, priority, list, positionInList, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.taskController.getTaskById(options.taskId)];
                    case 1:
                        task = _a.sent();
                        if (task instanceof models_1.LogError)
                            return [2 /*return*/, task];
                        if (!(options.statusId !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.statusService.getStatusById(options.statusId)];
                    case 2:
                        status_1 = _a.sent();
                        if (status_1 instanceof models_1.LogError)
                            return [2 /*return*/, status_1];
                        _a.label = 3;
                    case 3:
                        if (!(options.priorityId !== undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.priorityService.getPriorityById(options.priorityId)];
                    case 4:
                        priority = _a.sent();
                        if (priority instanceof models_1.LogError)
                            return [2 /*return*/, priority];
                        _a.label = 5;
                    case 5:
                        if (!(options.listId !== undefined && options.listId !== task.listId)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.listService.getListById(options.listId)];
                    case 6:
                        list = _a.sent();
                        if (list instanceof models_1.LogError)
                            return [2 /*return*/, list];
                        return [4 /*yield*/, this.getMaxPositionInListById(options.listId)];
                    case 7:
                        positionInList = _a.sent();
                        if (positionInList instanceof models_1.LogError)
                            return [2 /*return*/, positionInList];
                        options.positionInList = positionInList + 1;
                        _a.label = 8;
                    case 8: return [4 /*yield*/, this.taskController.updateTask(options)];
                    case 9:
                        update = _a.sent();
                        if (!(options.listId !== undefined && options.listId !== task.listId)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.reorderPositionsInListAfterDeleted(task.listId, task.positionInList)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/, update];
                }
            });
        });
    };
    /**
     * Modification de la position dans une liste d'une task selon son id
     * @param taskId
     * @param newPositionInList
     */
    TaskServiceImpl.prototype.updatePositionInListTask = function (taskId, newPositionInList) {
        return __awaiter(this, void 0, void 0, function () {
            var task, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.taskController.getTaskById(taskId)];
                    case 1:
                        task = _b.sent();
                        if (task instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        if (task.positionInList === newPositionInList)
                            return [2 /*return*/, true];
                        if (!(task.positionInList < newPositionInList)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.taskController.updatePositionInListTaskMinus(taskId, newPositionInList)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.taskController.updatePositionInListTaskPlus(taskId, newPositionInList)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, _a];
                }
            });
        });
    };
    /**
     * récupération de la position maximale dans un tableau depuis son
     * @param listId
     */
    TaskServiceImpl.prototype.getMaxPositionInListById = function (listId) {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listService.getListById(listId)];
                    case 1:
                        list = _a.sent();
                        if (list instanceof models_1.LogError)
                            return [2 /*return*/, list];
                        return [4 /*yield*/, this.taskController.getMaxPositionInListById(listId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Ordonner les positions dans le tableau après suppression
     * @param listId
     * @param positionDeleted
     */
    TaskServiceImpl.prototype.reorderPositionsInListAfterDeleted = function (listId, positionDeleted) {
        return __awaiter(this, void 0, void 0, function () {
            var list, listTasks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listService.getListById(listId)];
                    case 1:
                        list = _a.sent();
                        if (list instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.getAllTasksFromList(list.listId)];
                    case 2:
                        listTasks = _a.sent();
                        if (listTasks instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        if (!(listTasks.length > 1 || (listTasks.length === 1 && listTasks[0].positionInList !== 1))) return [3 /*break*/, 4];
                        if (!(positionDeleted !== 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.taskController.reorderPositionsInListAfterDeleted(listId, positionDeleted)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Récupère toutes les tâches liés à une liste
     * @param listId
     * @param options
     */
    TaskServiceImpl.prototype.getAllTasksFromList = function (listId, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.taskController.getAllTasksFromList(listId, options)];
            });
        });
    };
    /**
     * Assigne un développeur à une tâche
     * @param taskId
     * @param userMail
     */
    TaskServiceImpl.prototype.assignUserToTask = function (taskId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var task, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.taskController.getTaskById(taskId)];
                    case 1:
                        task = _a.sent();
                        if (task instanceof models_1.LogError)
                            return [2 /*return*/, task];
                        return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [2 /*return*/, this.taskController.assignUserToTask(taskId, userMail)];
                }
            });
        });
    };
    /**
     * Désassigne un développeur à une tâche
     * @param taskId
     * @param userMail
     */
    TaskServiceImpl.prototype.unassignUserToTask = function (taskId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var task, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.taskController.getTaskById(taskId)];
                    case 1:
                        task = _a.sent();
                        if (task instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.userService.getUserByMail(userMail)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [2 /*return*/, this.taskController.unassignUserToTask(taskId, userMail)];
                }
            });
        });
    };
    return TaskServiceImpl;
}());
exports.TaskServiceImpl = TaskServiceImpl;
