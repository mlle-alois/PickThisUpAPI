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
exports.taskRouter = void 0;
var express_1 = __importDefault(require("express"));
var database_1 = require("../database/database");
var auth_middleware_1 = require("../middlewares/auth-middleware");
var Utils_1 = require("../Utils");
var impl_1 = require("../services/impl");
var models_1 = require("../models");
var taskRouter = express_1.default.Router();
exports.taskRouter = taskRouter;
/**
 * ajout d'une tache
 * URL : /task/add
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.post("/add", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, taskService, id, name_1, description, deadline, priorityId, listId, positionInList, creatorId, creationDate, task, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 7];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    taskService = new impl_1.TaskServiceImpl(connection);
                    return [4 /*yield*/, taskService.getMaxTaskId()];
                case 3:
                    id = (_a.sent()) + 1;
                    name_1 = req.body.name;
                    description = req.body.description ? req.body.description : null;
                    deadline = req.body.deadline ? req.body.deadline : null;
                    priorityId = req.body.priorityId ? req.body.priorityId : null;
                    listId = req.body.listId;
                    if (name_1 === undefined || description === undefined || listId === undefined ||
                        deadline === undefined || priorityId === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, taskService.getMaxPositionInListById(listId)];
                case 4:
                    positionInList = _a.sent();
                    if (positionInList instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, positionInList)];
                    return [4 /*yield*/, (0, Utils_1.getUserMailConnected)(req)];
                case 5:
                    creatorId = _a.sent();
                    if (creatorId instanceof models_1.LogError)
                        return [2 /*return*/, models_1.LogError.HandleStatus(res, creatorId)];
                    creationDate = Utils_1.DateUtils.getCurrentDate();
                    return [4 /*yield*/, taskService.createTask({
                            taskId: id,
                            taskName: name_1,
                            taskDescription: description,
                            taskCreationDate: creationDate,
                            taskDeadline: deadline,
                            positionInList: positionInList + 1,
                            priorityId: priorityId,
                            listId: listId,
                            creatorId: creatorId
                        })];
                case 6:
                    task = _a.sent();
                    if (task instanceof models_1.LogError) {
                        models_1.LogError.HandleStatus(res, task);
                    }
                    else {
                        res.status(201);
                        res.json(task);
                    }
                    _a.label = 7;
                case 7:
                    res.status(403).end();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération de toutes les taches
 * URL : /task?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, taskService, limit, offset, tasks, err_2;
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
                    taskService = new impl_1.TaskServiceImpl(connection);
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    return [4 /*yield*/, taskService.getAllTasks({
                            limit: limit,
                            offset: offset
                        })];
                case 3:
                    tasks = _a.sent();
                    res.json(tasks);
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
 * récupération d'une tache selon son id
 * URL : /task/get/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, taskService, id, task, err_3;
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
                    taskService = new impl_1.TaskServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, taskService.getTaskById(Number.parseInt(id))];
                case 3:
                    task = _a.sent();
                    if (task instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, task);
                    else
                        res.json(task);
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
 * récupération des membres d'une tâche
 * URL : /task/getMembers/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/getMembers/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, taskService, id, members, err_4;
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
                    taskService = new impl_1.TaskServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, taskService.getMembersByTaskId(Number.parseInt(id))];
                case 3:
                    members = _a.sent();
                    res.json(members);
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
 * modification d'une tache selon son id
 * URL : /task/update/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, name_2, description, deadline, statusId, priorityId, listId, connection, taskService, task, err_5;
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
                    deadline = req.body.deadline;
                    statusId = req.body.statusId;
                    priorityId = req.body.priorityId;
                    listId = req.body.listId;
                    if (id === undefined || (name_2 === undefined && description === undefined &&
                        listId === undefined && deadline === undefined && statusId === undefined &&
                        priorityId === undefined)) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    taskService = new impl_1.TaskServiceImpl(connection);
                    return [4 /*yield*/, taskService.updateTask({
                            taskId: Number.parseInt(id),
                            taskName: name_2,
                            taskDescription: description,
                            taskDeadline: deadline,
                            statusId: statusId,
                            priorityId: priorityId,
                            listId: listId
                        })];
                case 3:
                    task = _a.sent();
                    if (task instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, task);
                    else
                        res.json(task);
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
 * modification de la position dans un tableau d'une tache selon son id
 * URL : /task/update-position/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.put("/update-position/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, positionInList, connection, taskService, success, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    id = req.params.id;
                    positionInList = req.body.position;
                    if (id === undefined || positionInList === undefined) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    taskService = new impl_1.TaskServiceImpl(connection);
                    return [4 /*yield*/, taskService.updatePositionInListTask(Number.parseInt(id), positionInList)];
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
                    err_6 = _a.sent();
                    next(err_6);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * suppression d'une tache selon son id
 * URL : /task/delete/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, taskService, id, success, err_7;
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
                    taskService = new impl_1.TaskServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, taskService.deleteTaskById(Number.parseInt(id))];
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
                    err_7 = _a.sent();
                    next(err_7);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * URL : /task/list/:id?limit={x}&offset={x}
 * Récupère toutes les tâches liées à une liste
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/list/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, taskService, id, limit, offset, task, err_8;
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
                    taskService = new impl_1.TaskServiceImpl(connection);
                    id = req.params.id;
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, taskService.getAllTasksFromList(Number.parseInt(id), { limit: limit, offset: offset })];
                case 3:
                    task = _a.sent();
                    if (task instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, task);
                    else
                        res.json(task);
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
 * assignation d'un développeur à une tâche
 * URL : /task/assign
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.post("/assign", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, taskService, taskId, userMail, assignation, err_9;
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
                    taskService = new impl_1.TaskServiceImpl(connection);
                    taskId = req.body.taskId;
                    userMail = req.body.userMail;
                    if (taskId === undefined || userMail === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, taskService.assignUserToTask(Number.parseInt(taskId), userMail)];
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
                    err_9 = _a.sent();
                    next(err_9);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * désassignation d'un développeur à une tâche
 * URL : /task/unassign?taskId={x}&userMail={x}
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.delete("/unassign", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, taskService, taskId, userMail, success, err_10;
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
                    taskService = new impl_1.TaskServiceImpl(connection);
                    taskId = req.query.taskId;
                    userMail = req.query.userMail;
                    if (taskId === undefined || userMail === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, taskService.unassignUserToTask(Number.parseInt(taskId), userMail)];
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
