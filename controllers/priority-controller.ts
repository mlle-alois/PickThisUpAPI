import {LogError, PriorityModel} from "../models";
import {Connection, RowDataPacket} from "mysql2/promise";

export class PriorityController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Récupération d'un statut depuis son :
     * @param priorityId
     */
    async getPriorityById(priorityId: number): Promise<PriorityModel | LogError> {
        const res = await this.connection.query(`SELECT priority_id, priority_libelle
                                                 FROM PRIORITY
                                                 where priority_id = ?`, [
            priorityId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new PriorityModel({
                    priorityId: row["priority_id"],
                    priorityLibelle: row["priority_libelle"]
                });
            }
        }
        return new LogError({numError: 404, text: "Priority not found"});
    }
}