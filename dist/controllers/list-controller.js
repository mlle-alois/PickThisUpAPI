"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListController = void 0;
const models_1 = require("../models");
class ListController {
    constructor(connection) {
        this.connection = connection;
    }
    async getAllLists(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT list_id, list_name, position_in_board, board_id
                                                 FROM LIST LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.ListModel({
                    listId: row["list_id"],
                    listName: row["list_name"],
                    positionInBoard: row["position_in_board"],
                    boardId: row["board_id"]
                });
            });
        }
        return [];
    }
    async getListById(listId) {
        const res = await this.connection.query(`SELECT list_id, list_name, position_in_board, board_id
                                                 FROM LIST
                                                 where list_id = ?`, [
            listId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.ListModel({
                    listId: row["list_id"],
                    listName: row["list_name"],
                    positionInBoard: row["position_in_board"],
                    boardId: row["board_id"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "List not found" });
    }
    async getMaxListId() {
        const res = await this.connection.query('SELECT MAX(list_id) as maxId FROM LIST');
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
    async createList(options) {
        try {
            await this.connection.execute(`INSERT INTO LIST (list_id, list_name, position_in_board, board_id)
                                           VALUES (?, ?, ?, ?)`, [
                options.listId,
                options.listName,
                options.positionInBoard,
                options.boardId
            ]);
            return await this.getListById(options.listId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during list creation" });
        }
    }
    async deleteListsById(listId) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM LIST
                                                     WHERE list_id = ?`, [
                listId
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async updateList(options) {
        const setClause = [];
        const params = [];
        if (options.listName !== undefined) {
            setClause.push("list_name = ?");
            params.push(options.listName);
        }
        if (options.boardId !== undefined) {
            setClause.push("board_id = ?");
            params.push(options.boardId);
            setClause.push("position_in_board = ?");
            params.push(options.positionInBoard);
        }
        params.push(options.listId);
        try {
            const res = await this.connection.execute(`UPDATE LIST SET ${setClause.join(", ")} WHERE list_id = ?`, params);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getListById(options.listId);
            }
            return new models_1.LogError({ numError: 400, text: "The list update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The list update failed" });
        }
    }
    async getMaxPositionInBoardById(boardId) {
        const res = await this.connection.query(`SELECT COALESCE(MAX(position_in_board), 0) as maxId
                                                 FROM BOARD
                                                          INNER JOIN LIST ON LIST.board_id = BOARD.board_id
                                                     AND BOARD.board_id = ?`, [
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
    async reorderPositionsInBoardAfterDeleted(listId, positionDeleted) {
        const res = await this.connection.query(`UPDATE LIST
                                                 SET position_in_board = position_in_board - 1
                                                 WHERE board_id = ?
                                                   AND position_in_board >= ?`, [
            listId,
            positionDeleted
        ]);
        const headers = res[0];
        return headers.affectedRows > 0;
    }
    async updatePositionInBoardListPlus(listId, newPositionInBoard) {
        let res = await this.connection.query(`UPDATE LIST
                                               SET position_in_board = position_in_board + 1
                                               WHERE board_id = (SELECT board_id
                                                                 FROM LIST
                                                                 WHERE list_id = ?)
                                                 AND position_in_board >= ?
                                                 AND position_in_board < (SELECT position_in_board
                                                                          FROM LIST
                                                                          WHERE list_id = ?)`, [
            listId,
            newPositionInBoard,
            listId
        ]);
        let headers = res[0];
        if (headers.affectedRows > 0) {
            res = await this.connection.query(`UPDATE LIST
                                               SET position_in_board = ?
                                               WHERE list_id = ?`, [
                newPositionInBoard,
                listId
            ]);
            headers = res[0];
            return headers.affectedRows > 0;
        }
        return false;
    }
    async updatePositionInBoardListMinus(listId, newPositionInBoard) {
        let res = await this.connection.query(`UPDATE LIST
                                               SET position_in_board = position_in_board - 1
                                               WHERE board_id = (SELECT board_id
                                                                 FROM LIST
                                                                 WHERE list_id = ?)
                                                 AND position_in_board > (SELECT position_in_board
                                                                          FROM LIST
                                                                          WHERE list_id = ?)
                                                 AND position_in_board <= ?`, [
            listId,
            listId,
            newPositionInBoard
        ]);
        let headers = res[0];
        if (headers.affectedRows > 0) {
            res = await this.connection.query(`UPDATE LIST
                                               SET position_in_board = ?
                                               WHERE list_id = ?`, [
                newPositionInBoard,
                listId
            ]);
            headers = res[0];
            return headers.affectedRows > 0;
        }
        return false;
    }
    async getListByBoardId(boardId) {
        const res = await this.connection.query(`SELECT list_id, list_name, position_in_board, board_id
                                                 FROM LIST
                                                 where board_id = ?`, [
            boardId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.ListModel({
                    listId: row["list_id"],
                    listName: row["list_name"],
                    positionInBoard: row["position_in_board"],
                    boardId: row["board_id"]
                });
            });
        }
        return new models_1.LogError({ numError: 404, text: "List not found" });
    }
}
exports.ListController = ListController;
//# sourceMappingURL=list-controller.js.map