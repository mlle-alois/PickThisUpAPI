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
        const res = await this.connection.query(`SELECT pollution_level_id,
                                                        pollution_level_libelle
                                                 FROM POLLUTION_LEVEL
                                                 where pollution_level_id = ?`, [
            pollutionLevelId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new PollutionLevelModel({
                    pollutionLevelId: row["pollution_level_id"],
                    pollutionLevelLibelle: row["pollution_level_libelle"]
                });
            }
        }
        return new LogError({numError: 404, text: "User type not found"});
    }
}