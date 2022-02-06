"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const models_1 = require("../models");
const user_controller_1 = require("./user-controller");
class TaskController {
    constructor(connection) {
        this.connection = connection;
    }
    async getAllTasks(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT task_id,
                                                        task_name,
                                                        task_description,
                                                        task_creation_date,
                                                        task_deadline,
                                                        position_in_list,
                                                        status_id,
                                                        priority_id,
                                                        list_id,
                                                        creator_id
                                                 FROM TASK LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
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
            });
        }
        return [];
    }
    async getTaskById(taskId) {
        const res = await this.connection.query(`SELECT task_id,
                                                        task_name,
                                                        task_description,
                                                        task_creation_date,
                                                        task_deadline,
                                                        position_in_list,
                                                        status_id,
                                                        priority_id,
                                                        list_id,
                                                        creator_id
                                                 FROM TASK
                                                 where task_id = ?`, [
            taskId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
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
            }
        }
        return new models_1.LogError({ numError: 404, text: "Task not found" });
    }
    async getMaxTaskId() {
        const res = await this.connection.query('SELECT MAX(task_id) as maxId FROM TASK');
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                if (row["maxId"] === null) {
                    return 0;
                }
                else {
                    return row["maxId"];
                }
            }
        }
        return 0;
    }
    async createTask(options) {
        try {
            await this.connection.execute(`INSERT INTO TASK (task_id, task_name, task_description, task_creation_date,
                                                             task_deadline, position_in_list, status_id, priority_id,
                                                             list_id, creator_id)
                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
            ]);
            return await this.getTaskById(options.taskId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during task creation" });
        }
    }
    async deleteTasksById(taskId) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM TASK
                                                     WHERE task_id = ?`, [
                taskId
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async updateTask(options) {
        const setClause = [];
        const params = [];
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
        try {
            const res = await this.connection.execute(`UPDATE TASK SET ${setClause.join(", ")} WHERE task_id = ?`, params);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getTaskById(options.taskId);
            }
            return new models_1.LogError({ numError: 400, text: "The task update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The task update failed" });
        }
    }
    async getMaxPositionInListById(boardId) {
        const res = await this.connection.query(`SELECT COALESCE(MAX(position_in_list), 0) as maxId
                                                 FROM LIST
                                                          INNER JOIN TASK ON TASK.list_id = LIST.list_id
                                                     AND LIST.list_id = ?`, [
            boardId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                if (row["maxId"] === null) {
                    return 0;
                }
                else {
                    return row["maxId"];
                }
            }
        }
        return 0;
    }
    async reorderPositionsInListAfterDeleted(taskId, positionDeleted) {
        const res = await this.connection.query(`UPDATE TASK
                                                 SET position_in_list = position_in_list - 1
                                                 WHERE list_id = ?
                                                   AND position_in_list >= ?`, [
            taskId,
            positionDeleted
        ]);
        const headers = res[0];
        return headers.affectedRows > 0;
    }
    async updatePositionInListTaskPlus(taskId, newPositionInBoard) {
        let res = await this.connection.query(`UPDATE TASK
                                               SET position_in_list = position_in_list + 1
                                               WHERE list_id = (SELECT list_id
                                                                FROM TASK
                                                                WHERE task_id = ?)
                                                 AND position_in_list >= ?
                                                 AND position_in_list < (SELECT position_in_list
                                                                         FROM TASK
                                                                         WHERE task_id = ?)`, [
            taskId,
            newPositionInBoard,
            taskId
        ]);
        let headers = res[0];
        if (headers.affectedRows > 0) {
            res = await this.connection.query(`UPDATE TASK
                                               SET position_in_list = ?
                                               WHERE task_id = ?`, [
                newPositionInBoard,
                taskId
            ]);
            headers = res[0];
            return headers.affectedRows > 0;
        }
        return false;
    }
    async updatePositionInListTaskMinus(taskId, newPositionInBoard) {
        let res = await this.connection.query(`UPDATE TASK
                                               SET position_in_list = position_in_list - 1
                                               WHERE list_id = (SELECT list_id
                                                                FROM TASK
                                                                WHERE task_id = ?)
                                                 AND position_in_list > (SELECT position_in_list
                                                                         FROM TASK
                                                                         WHERE task_id = ?)
                                                 AND position_in_list <= ?`, [
            taskId,
            taskId,
            newPositionInBoard
        ]);
        let headers = res[0];
        if (headers.affectedRows > 0) {
            res = await this.connection.query(`UPDATE TASK
                                               SET position_in_list = ?
                                               WHERE task_id = ?`, [
                newPositionInBoard,
                taskId
            ]);
            headers = res[0];
            return headers.affectedRows > 0;
        }
        return false;
    }
    async getAllTasksFromList(listId, options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT task_id,
                                                        task_name,
                                                        task_description,
                                                        task_creation_date,
                                                        task_deadline,
                                                        position_in_list,
                                                        status_id,
                                                        priority_id,
                                                        list_id,
                                                        creator_id
                                                 FROM TASK
                                                 WHERE list_id = ? LIMIT ?, ?`, [
            listId, offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            if (data.length === 0)
                return new models_1.LogError({ numError: 404, text: "No tasks found " });
            return data.map(function (row) {
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
            });
        }
        return new models_1.LogError({ numError: 404, text: "No tasks found " });
    }
    async getMembersByTaskId(ticketId) {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        user_type_id
                                                 FROM ${user_controller_1.UserController.userTable}
                                                          JOIN PARTICIPATE_USER_TASK
                                                               ON PARTICIPATE_USER_TASK.user_id = ${user_controller_1.UserController.userTable}.user_mail
                                                 where task_id = ?`, [
            ticketId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    typeId: row["user_type_id"]
                });
            });
        }
        return [];
    }
    async assignUserToTask(taskId, userMail) {
        try {
            await this.connection.execute(`INSERT IGNORE INTO PARTICIPATE_USER_TASK (user_id, task_id)
                                           VALUES (?, ?)`, [
                userMail, taskId
            ]);
            return await this.getTaskById(taskId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during assignation" });
        }
    }
    async unassignUserToTask(taskId, userMail) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM PARTICIPATE_USER_TASK
                                                     WHERE task_id = ?
                                                     AND user_id = ?`, [
                taskId, userMail
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=task-controller.js.map