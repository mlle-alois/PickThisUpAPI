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
exports.TaskController = void 0;
var models_1 = require("../models");
var user_controller_1 = require("./user-controller");
var TaskController = /** @class */ (function () {
    function TaskController(connection) {
        this.connection = connection;
    }
    TaskController.prototype.getAllTasks = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
                        offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
                        return [4 /*yield*/, this.connection.query("SELECT task_id,\n                                                        task_name,\n                                                        task_description,\n                                                        task_creation_date,\n                                                        task_deadline,\n                                                        position_in_list,\n                                                        status_id,\n                                                        priority_id,\n                                                        list_id,\n                                                        creator_id\n                                                 FROM TASK LIMIT ?, ?", [
                                offset, limit
                            ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.TaskModel({
                                        taskId: row["task_id"],
                                        taskName: row["task_name"],
                                        taskDescription: row["task_description"],
                                        taskCreationDate: row["task_creation_date"],
                                        taskDeadline: row["task_deadline"],
                                        positionInList: row["position_in_list"],
                                        statusId: row["status_id"],
                                        priorityId: row["priority_id"],
                                        listId: row["list_id"],
                                        creatorId: row["creator_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    TaskController.prototype.getTaskById = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT task_id,\n                                                        task_name,\n                                                        task_description,\n                                                        task_creation_date,\n                                                        task_deadline,\n                                                        position_in_list,\n                                                        status_id,\n                                                        priority_id,\n                                                        list_id,\n                                                        creator_id\n                                                 FROM TASK\n                                                 where task_id = ?", [
                            taskId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.TaskModel({
                                        taskId: row["task_id"],
                                        taskName: row["task_name"],
                                        taskDescription: row["task_description"],
                                        taskCreationDate: row["task_creation_date"],
                                        taskDeadline: row["task_deadline"],
                                        positionInList: row["position_in_list"],
                                        statusId: row["status_id"],
                                        priorityId: row["priority_id"],
                                        listId: row["list_id"],
                                        creatorId: row["creator_id"]
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "Task not found" })];
                }
            });
        });
    };
    TaskController.prototype.getMaxTaskId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query('SELECT MAX(task_id) as maxId FROM TASK')];
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
    TaskController.prototype.createTask = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO TASK (task_id, task_name, task_description, task_creation_date,\n                                                             task_deadline, position_in_list, status_id, priority_id,\n                                                             list_id, creator_id)\n                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                                options.taskId,
                                options.taskName,
                                options.taskDescription,
                                options.taskCreationDate,
                                options.taskDeadline,
                                options.positionInList,
                                1,
                                options.priorityId,
                                options.listId,
                                options.creatorId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTaskById(options.taskId)];
                    case 2: 
                    //récupération de la task créée ou null si cela n'a pas fonctionné
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during task creation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TaskController.prototype.deleteTasksById = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM TASK\n                                                     WHERE task_id = ?", [
                                taskId
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
    TaskController.prototype.updateTask = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, params, res, headers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = [];
                        params = [];
                        //création des contenus de la requête dynamiquement
                        if (options.taskName !== undefined) {
                            setClause.push("task_name = ?");
                            params.push(options.taskName);
                        }
                        if (options.taskDescription !== undefined) {
                            setClause.push("task_description = ?");
                            params.push(options.taskDescription);
                        }
                        if (options.taskDeadline !== undefined) {
                            setClause.push("task_deadline = ?");
                            params.push(options.taskDeadline);
                        }
                        if (options.statusId !== undefined) {
                            setClause.push("status_id = ?");
                            params.push(options.statusId);
                        }
                        if (options.priorityId !== undefined) {
                            setClause.push("priority_id = ?");
                            params.push(options.priorityId);
                        }
                        if (options.listId !== undefined) {
                            setClause.push("list_id = ?");
                            params.push(options.listId);
                            setClause.push("position_in_list = ?");
                            params.push(options.positionInList);
                        }
                        params.push(options.taskId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("UPDATE TASK SET ".concat(setClause.join(", "), " WHERE task_id = ?"), params)];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getTaskById(options.taskId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The task update failed" })];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The task update failed" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TaskController.prototype.getMaxPositionInListById = function (boardId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT COALESCE(MAX(position_in_list), 0) as maxId\n                                                 FROM LIST\n                                                          INNER JOIN TASK ON TASK.list_id = LIST.list_id\n                                                     AND LIST.list_id = ?", [
                            boardId
                        ])];
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
    TaskController.prototype.reorderPositionsInListAfterDeleted = function (taskId, positionDeleted) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("UPDATE TASK\n                                                 SET position_in_list = position_in_list - 1\n                                                 WHERE list_id = ?\n                                                   AND position_in_list >= ?", [
                            taskId,
                            positionDeleted
                        ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                }
            });
        });
    };
    TaskController.prototype.updatePositionInListTaskPlus = function (taskId, newPositionInBoard) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("UPDATE TASK\n                                               SET position_in_list = position_in_list + 1\n                                               WHERE list_id = (SELECT list_id\n                                                                FROM TASK\n                                                                WHERE task_id = ?)\n                                                 AND position_in_list >= ?\n                                                 AND position_in_list < (SELECT position_in_list\n                                                                         FROM TASK\n                                                                         WHERE task_id = ?)", [
                            taskId,
                            newPositionInBoard,
                            taskId
                        ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (!(headers.affectedRows > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.connection.query("UPDATE TASK\n                                               SET position_in_list = ?\n                                               WHERE task_id = ?", [
                                newPositionInBoard,
                                taskId
                            ])];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    TaskController.prototype.updatePositionInListTaskMinus = function (taskId, newPositionInBoard) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("UPDATE TASK\n                                               SET position_in_list = position_in_list - 1\n                                               WHERE list_id = (SELECT list_id\n                                                                FROM TASK\n                                                                WHERE task_id = ?)\n                                                 AND position_in_list > (SELECT position_in_list\n                                                                         FROM TASK\n                                                                         WHERE task_id = ?)\n                                                 AND position_in_list <= ?", [
                            taskId,
                            taskId,
                            newPositionInBoard
                        ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (!(headers.affectedRows > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.connection.query("UPDATE TASK\n                                               SET position_in_list = ?\n                                               WHERE task_id = ?", [
                                newPositionInBoard,
                                taskId
                            ])];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    TaskController.prototype.getAllTasksFromList = function (listId, options) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
                        offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
                        return [4 /*yield*/, this.connection.query("SELECT task_id,\n                                                        task_name,\n                                                        task_description,\n                                                        task_creation_date,\n                                                        task_deadline,\n                                                        position_in_list,\n                                                        status_id,\n                                                        priority_id,\n                                                        list_id,\n                                                        creator_id\n                                                 FROM TASK\n                                                 WHERE list_id = ? LIMIT ?, ?", [
                                listId, offset, limit
                            ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            if (data.length === 0)
                                return [2 /*return*/, new models_1.LogError({ numError: 404, text: "No tasks found " })];
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.TaskModel({
                                        taskId: row["task_id"],
                                        taskName: row["task_name"],
                                        taskDescription: row["task_description"],
                                        taskCreationDate: row["task_creation_date"],
                                        taskDeadline: row["task_deadline"],
                                        positionInList: row["position_in_list"],
                                        statusId: row["status_id"],
                                        priorityId: row["priority_id"],
                                        listId: row["list_id"],
                                        creatorId: row["creator_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "No tasks found " })];
                }
            });
        });
    };
    TaskController.prototype.getMembersByTaskId = function (ticketId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT user_mail,\n                                                        user_password,\n                                                        user_name,\n                                                        user_firstname,\n                                                        user_phone_number,\n                                                        profile_picture_id,\n                                                        user_type_id\n                                                 FROM ".concat(user_controller_1.UserController.userTable, "\n                                                          JOIN PARTICIPATE_USER_TASK\n                                                               ON PARTICIPATE_USER_TASK.user_id = ").concat(user_controller_1.UserController.userTable, ".user_mail\n                                                 where task_id = ?"), [
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
    TaskController.prototype.assignUserToTask = function (taskId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT IGNORE INTO PARTICIPATE_USER_TASK (user_id, task_id)\n                                           VALUES (?, ?)", [
                                userMail, taskId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTaskById(taskId)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        err_4 = _a.sent();
                        console.error(err_4);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during assignation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TaskController.prototype.unassignUserToTask = function (taskId, userMail) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM PARTICIPATE_USER_TASK\n                                                     WHERE task_id = ?\n                                                     AND user_id = ?", [
                                taskId, userMail
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 2:
                        err_5 = _a.sent();
                        console.error(err_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TaskController;
}());
exports.TaskController = TaskController;
