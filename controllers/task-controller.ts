import {TaskModel, LogError} from "../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";

export interface TaskGetAllOptions {
    limit?: number;
    offset?: number;
}

export interface TaskUpdateOptions {
    taskId: number;
    taskName: string;
    taskDescription: string;
    taskDeadline: Date;
    positionInList?: number;
    statusId: number;
    priorityId: number;
    listId: number;
}

export class TaskController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getAllTasks(options?: TaskGetAllOptions): Promise<TaskModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

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
            return (data as RowDataPacket[]).map(function (row: any) {
                return new TaskModel({
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

    async getTaskById(taskId: number): Promise<TaskModel | LogError> {
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
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new TaskModel({
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
        return new LogError({numError: 404, text: "Task not found"});
    }

    async getMaxTaskId(): Promise<number> {
        const res = await this.connection.query('SELECT MAX(task_id) as maxId FROM TASK');
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                if (row["maxId"] === null) {
                    return 0;
                } else {
                    return row["maxId"];
                }
            }
        }
        return 0;
    }

    async createTask(options: TaskModel): Promise<TaskModel | LogError> {
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
                options.statusId,
                options.priorityId,
                options.listId,
                options.creatorId
            ]);
            //récupération de la task créée ou null si cela n'a pas fonctionné
            return await this.getTaskById(options.taskId);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during task creation"});
        }
    }

    async deleteTasksById(taskId: number): Promise<boolean> {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM TASK
                                                     WHERE task_id = ?`, [
                taskId
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async updateTask(options: TaskUpdateOptions): Promise<TaskModel | LogError> {
        const setClause: string[] = [];
        const params = [];
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
        try {
            const res = await this.connection.execute(`UPDATE TASK SET ${setClause.join(", ")} WHERE task_id = ?`, params);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getTaskById(options.taskId);
            }
            return new LogError({numError: 400, text: "The task update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The task update failed"});
        }
    }

    async getMaxPositionInListById(boardId: number): Promise<number | LogError> {
        const res = await this.connection.query(`SELECT COALESCE(MAX(position_in_list), 0) as maxId
                                                 FROM LIST
                                                          INNER JOIN TASK ON TASK.list_id = LIST.list_id
                                                     AND LIST.list_id = ?`, [
            boardId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                if (row["maxId"] === null) {
                    return 0;
                } else {
                    return row["maxId"];
                }
            }
        }
        return 0;
    }

    async reorderPositionsInListAfterDeleted(taskId: number, positionDeleted: number): Promise<boolean> {
        const res = await this.connection.query(`UPDATE TASK
                                                 SET position_in_list = position_in_list - 1
                                                 WHERE list_id = ?
                                                   AND position_in_list >= ?`, [
            taskId,
            positionDeleted
        ]);
        const headers = res[0] as ResultSetHeader;
        return headers.affectedRows > 0;

    }

    async updatePositionInListTaskPlus(taskId: number, newPositionInBoard: number): Promise<boolean> {
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
        let headers = res[0] as ResultSetHeader;
        if (headers.affectedRows > 0) {
            res = await this.connection.query(`UPDATE TASK
                                               SET position_in_list = ?
                                               WHERE task_id = ?`, [
                newPositionInBoard,
                taskId
            ]);
            headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        }
        return false;
    }

    async updatePositionInListTaskMinus(taskId: number, newPositionInBoard: number): Promise<boolean> {
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
        let headers = res[0] as ResultSetHeader;
        if (headers.affectedRows > 0) {
            res = await this.connection.query(`UPDATE TASK
                                               SET position_in_list = ?
                                               WHERE task_id = ?`, [
                newPositionInBoard,
                taskId
            ]);
            headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        }
        return false;
    }
}