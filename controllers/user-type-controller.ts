import {UserModel, UserTypeModel} from "../models";
import {Connection, RowDataPacket} from "mysql2/promise";
import {UserController} from "./user-controller";
import {SessionController} from "./session-controller";

export class UserTypeController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Récupération d'un type utilisateur depuis son :
     * @param userTypeId
     */
    async getUserTypeById(userTypeId: number): Promise<UserTypeModel | null> {
        const res = await this.connection.query(`SELECT user_type_id,
                                                        user_type_libelle
                                                 FROM USER_TYPE
                                                 where user_type_id = ?`, [
            userTypeId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new UserTypeModel({
                    userTypeId: row["user_type_id"],
                    userTypeLibelle: row["user_type_libelle"]
                });
            }
        }
        return null;
    }
}