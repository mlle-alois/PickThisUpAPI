import {ListModel, LogError} from "../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";

export interface ListGetAllOptions {
    limit?: number;
    offset?: number;
}

export interface ListUpdateProps {
    listId: number;
    listName: string;
    positionInBoard?: number;
    boardId: number;
}

export class ListController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getAllLists(options?: ListGetAllOptions): Promise<ListModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const res = await this.connection.query(`SELECT list_id, list_name, position_in_board, board_id
                                                 FROM LIST LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new ListModel({
                    listId: row["list_id"],
                    listName: row["list_name"],
                    positionInBoard: row["position_in_board"],
                    boardId: row["board_id"]
                });
            });
        }
        return [];
    }

    async getListById(listId: number): Promise<ListModel | LogError> {
        const res = await this.connection.query(`SELECT list_id, list_name, position_in_board, board_id
                                                 FROM LIST
                                                 where list_id = ?`, [
            listId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new ListModel({
                    listId: row["list_id"],
                    listName: row["list_name"],
                    positionInBoard: row["position_in_board"],
                    boardId: row["board_id"]
                });
            }
        }
        return new LogError({numError: 404, text: "List not found"});
    }

    async getMaxListId(): Promise<number> {
        const res = await this.connection.query('SELECT MAX(list_id) as maxId FROM LIST');
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

    async createList(options: ListModel): Promise<ListModel | LogError> {
        try {
            await this.connection.execute(`INSERT INTO LIST (list_id, list_name, position_in_board, board_id)
                                           VALUES (?, ?, ?, ?)`, [
                options.listId,
                options.listName,
                options.positionInBoard,
                options.boardId
            ]);
            //récupération de la list créée ou null si cela n'a pas fonctionné
            return await this.getListById(options.listId);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during list creation"});
        }
    }

    async deleteListsById(listId: number): Promise<boolean> {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM LIST
                                                     WHERE list_id = ?`, [
                listId
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async updateList(options: ListUpdateProps): Promise<ListModel | LogError> {
        const setClause: string[] = [];
        const params = [];
        //création des contenus de la requête dynamiquement
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
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getListById(options.listId);
            }
            return new LogError({numError: 400, text: "The list update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The list update failed"});
        }
    }

    async getMaxPositionInBoardById(boardId: number): Promise<number | LogError> {
        const res = await this.connection.query(`SELECT COALESCE(MAX(position_in_board), 0) as maxId
                                                 FROM BOARD
                                                          INNER JOIN LIST ON LIST.board_id = BOARD.board_id
                                                     AND BOARD.board_id = ?`, [
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

    async reorderPositionsInBoardAfterDeleted(listId: number, positionDeleted: number): Promise<boolean> {
        const res = await this.connection.query(`UPDATE LIST
                                                 SET position_in_board = position_in_board - 1
                                                 WHERE board_id = ?
                                                   AND position_in_board >= ?`, [
            listId,
            positionDeleted
        ]);
        const headers = res[0] as ResultSetHeader;
        return headers.affectedRows > 0;

    }

    async updatePositionInBoardListPlus(listId: number, newPositionInBoard: number): Promise<boolean> {
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
        let headers = res[0] as ResultSetHeader;
        if (headers.affectedRows > 0) {
            res = await this.connection.query(`UPDATE LIST
                                               SET position_in_board = ?
                                               WHERE list_id = ?`, [
                newPositionInBoard,
                listId
            ]);
            headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        }
        return false;
    }

    async updatePositionInBoardListMinus(listId: number, newPositionInBoard: number): Promise<boolean> {
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
        let headers = res[0] as ResultSetHeader;
        if (headers.affectedRows > 0) {
            res = await this.connection.query(`UPDATE LIST
                                               SET position_in_board = ?
                                               WHERE list_id = ?`, [
                newPositionInBoard,
                listId
            ]);
            headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        }
        return false;
    }


    async getListByBoardId(boardId: number): Promise<ListModel[] | LogError> {
        const res = await this.connection.query(`SELECT list_id, list_name, position_in_board, board_id
                                                 FROM LIST
                                                 where board_id = ?`, [
            boardId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new ListModel({
                    listId: row["list_id"],
                    listName: row["list_name"],
                    positionInBoard: row["position_in_board"],
                    boardId: row["board_id"]
                });
            });
            }

        return new LogError({numError: 404, text: "List not found"});
    }
}