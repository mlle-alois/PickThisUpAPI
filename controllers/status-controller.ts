import {LogError, StatusModel} from "../models";
import {Connection, RowDataPacket} from "mysql2/promise";


export interface StatusGetAllOptions {
    limit?: number;
    offset?: number;
}

export class StatusController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Récupération d'un statut depuis son :
     * @param statusId
     */
    async getStatusById(statusId: number): Promise<StatusModel | LogError> {
        const res = await this.connection.query(`SELECT status_id, status_libelle
                                                 FROM STATUS
                                                 where status_id = ?`, [
            statusId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new StatusModel({
                    statusId: row["status_id"],
                    statusLibelle: row["status_libelle"]
                });
            }
        }
        return new LogError({numError: 404, text: "Status not found"});
    }

    /**
     * Récupère tous les status
     * @param options
     */
    async getAllStatus(options?: StatusGetAllOptions): Promise<StatusModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const res = await this.connection.query(`SELECT status_id,
                                                        status_libelle
                                                 FROM STATUS LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new StatusModel({
                    statusId: row["status_id"],
                    statusLibelle: row["status_libelle"]
                });
            });
        }
        return [];
    }

}