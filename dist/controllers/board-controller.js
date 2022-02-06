"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const models_1 = require("../models");
class BoardController {
    constructor(connection) {
        this.connection = connection;
    }
    async getAllBoards(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT board_id,
                                                        board_name
                                                 FROM BOARD LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.BoardModel({
                    boardId: row["board_id"],
                    boardName: row["board_name"]
                });
            });
        }
        return [];
    }
    async getBoardById(boardId) {
        const res = await this.connection.query(`SELECT board_id,
                                                        board_name
                                                 FROM BOARD
                                                 where board_id = ?`, [
            boardId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.BoardModel({
                    boardId: row["board_id"],
                    boardName: row["board_name"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "Board not found" });
    }
    async getMaxBoardId() {
        const res = await this.connection.query('SELECT MAX(board_id) as maxId FROM BOARD');
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
    async createBoard(options) {
        try {
            await this.connection.execute(`INSERT INTO BOARD (board_id, board_name)
                                           VALUES (?, ?)`, [
                options.boardId,
                options.boardName
            ]);
            return await this.getBoardById(options.boardId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during board creation" });
        }
    }
    async deleteBoardsById(boardId) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM BOARD
                                                     WHERE board_id = ?`, [
                boardId
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async updateBoard(options) {
        const setClause = [];
        const params = [];
        if (options.boardName !== undefined) {
            setClause.push("board_name = ?");
            params.push(options.boardName);
        }
        params.push(options.boardId);
        try {
            const res = await this.connection.execute(`UPDATE BOARD SET ${setClause.join(", ")} WHERE board_id = ?`, params);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getBoardById(options.boardId);
            }
            return new models_1.LogError({ numError: 400, text: "The board update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The board update failed" });
        }
    }
}
exports.BoardController = BoardController;
//# sourceMappingURL=board-controller.js.map