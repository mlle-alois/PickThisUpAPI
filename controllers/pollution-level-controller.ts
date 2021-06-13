import {LogError, PollutionLevelModel} from "../models";
import {Connection, RowDataPacket} from "mysql2/promise";

export class PollutionLevelController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Récupération d'un type utilisateur depuis son :
     * @param pollutionLevelId
     */
    async getPollutionLevelById(pollutionLevelId: number): Promise<PollutionLevelModel | LogError> {
        const res = await this.connection.query(`SELECT user_type_id,
                                                        user_type_libelle
                                                 FROM POLLUTION_LEVEL
                                                 where user_type_id = ?`, [
            pollutionLevelId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new PollutionLevelModel({
                    pollutionLevelId: row["user_type_id"],
                    pollutionLevelLibelle: row["user_type_libelle"]
                });
            }
        }
        return new LogError({numError: 404, text: "User type not found"});
    }
}