import {BoardModel, LogError} from "../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";

export interface BoardGetAllOptions {
    limit?: number;
    offset?: number;
}

export class BoardController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getAllBoards(options?: BoardGetAllOptions): Promise<BoardModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const res = await this.connection.query(`SELECT board_id,
                                                        board_name
                                                 FROM BOARD LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new BoardModel({
                    boardId: row["board_id"],
                    boardName: row["board_name"]
                });
            });
        }
        return [];
    }

    async getBoardById(boardId: number): Promise<BoardModel | LogError> {
        const res = await this.connection.query(`SELECT board_id,
                                                        board_name
                                                 FROM BOARD
                                                 where board_id = ?`, [
            boardId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new BoardModel({
                    boardId: row["board_id"],
                    boardName: row["board_name"]
                });
            }
        }
        return new LogError({numError: 404, text: "Board not found"});
    }

    async getMaxBoardId(): Promise<number> {
        const res = await this.connection.query('SELECT MAX(board_id) as maxId FROM BOARD');
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

    async createBoard(options: BoardModel): Promise<BoardModel | LogError> {
        try {
            await this.connection.execute(`INSERT INTO BOARD (board_id, board_name)
                                           VALUES (?, ?)`, [
                options.boardId,
                options.boardName
            ]);
            //récupération de la board créée ou null si cela n'a pas fonctionné
            return await this.getBoardById(options.boardId);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during board creation"});
        }
    }

    async deleteBoardsById(boardId: number): Promise<boolean> {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM BOARD
                                                     WHERE board_id = ?`, [
                boardId
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows === 1;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async updateBoard(options: BoardModel): Promise<BoardModel | LogError> {
        const setClause: string[] = [];
        const params = [];
        //création des contenus de la requête dynamiquement
        if (options.boardName !== undefined) {
            setClause.push("board_name = ?");
            params.push(options.boardName);
        }
        params.push(options.boardId);
        try {
            const res = await this.connection.execute(`UPDATE BOARD SET ${setClause.join(", ")} WHERE board_id = ?`, params);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows === 1) {
                return this.getBoardById(options.boardId);
            }
            return new LogError({numError: 400, text: "The board update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The board update failed"});
        }
    }
}