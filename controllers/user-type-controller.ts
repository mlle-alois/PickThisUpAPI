import {LogError, UserTypeModel} from "../models";
import {Connection, RowDataPacket} from "mysql2/promise";
export interface UserTypeGetAllOptions {
    limit?: number;
    offset?: number;
}
export class UserTypeController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Récupération d'un type utilisateur depuis son :
     * @param userTypeId
     */
    async getUserTypeById(userTypeId: number): Promise<UserTypeModel | LogError> {
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
        return new LogError({numError: 404, text: "User type not found"});
    }

    /**
     * Récupération d'un type utilisateur depuis son :
     * @param options
     */
    async getUserTypes(options?: UserTypeGetAllOptions): Promise<UserTypeModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const res = await this.connection.query(`SELECT user_type_id,
                                                        user_type_libelle
                                                 FROM USER_TYPE
                                                 LIMIT ?, ?`, [
            offset,
            limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new UserTypeModel({
                    userTypeId: row["user_type_id"],
                    userTypeLibelle: row["user_type_libelle"]
                });
            });
        }
        return  [];
    }
}
