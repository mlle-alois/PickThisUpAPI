import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {UserController} from "./user-controller";
import {LogError, SessionModel} from "../models";

export class SessionController {

    private connection: Connection;
    private userController: UserController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.userController = new UserController(this.connection);
    }

    /**
     * Récupération de l'id de session maximum existant
     */
    async getMaxSessionId(): Promise<number> {
        const res = await this.connection.query('SELECT MAX(session_id) as maxId FROM SESSION');
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

    /**
     * Récupération d'une session depuis le token
     * @param token
     */
    async getSessionByToken(token: string): Promise<SessionModel | LogError> {
        //récupération de la session
        const res = await this.connection.query(`SELECT session_id, token, createdAt, updatedAt, deletedAt, user_id
                                                 FROM SESSION
                                                 where token = ? `, [
            token
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new SessionModel({
                    sessionId: Number.parseInt(row["session_id"]),
                    token: row["token"],
                    createdAt: row["createdAt"],
                    updatedAt: row["updatedAt"],
                    deletedAt: row["deletedAt"],
                    userId: row["user_id"]
                });
            }
        }
        return new LogError({numError: 404, text: "Session not found"});
    }

    /**
     * Création d'une session
     * @param sessionId
     * @param token
     * @param mail
     */
    async createSession(sessionId: number, token: string, mail: string): Promise<SessionModel | LogError> {
        try {
            //création de la session
            await this.connection.execute(`INSERT INTO SESSION (session_id, token, createdAt, updatedAt, user_id)
                                           VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`, [
                //incrémentation manuelle
                sessionId,
                token,
                mail
            ]);
            //récupération de la session créée ou null si cela n'a pas fonctionné
            return await this.getSessionByToken(token);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during session creation"});
        }
    }

    /**
     * récupérations des sessions associées à l'user mail
     * @param mail
     */
    async deleteOldSessionsByUserMail(mail: string): Promise<boolean> {
        try {
            //suppression de la session
            const res = await this.connection.query(`DELETE
                                                     FROM SESSION
                                                     WHERE user_id = ?`, [
                mail
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * Suppression d'une session depuis le token
     * @param token
     */
    async deleteSessionByToken(token: string): Promise<boolean> {
        try {
            //suppression de la session
            const res = await this.connection.query(`DELETE
                                                     FROM SESSION
                                                     WHERE token = ?`, [
                token
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    /**
     * Récupération d'une session en ajoutant 2 heure depuis le token
     * A utiliser si on veut effectuer le controle d'expiration du token en base
     * @param token
     */
    async getLastUpdatedTimePlus2Hours(token: string): Promise<string | undefined> {
        //récupération de la session

        const res = await this.connection.query(`SELECT (updatedAt + INTERVAL '2' HOUR) as updatedAt
                                                 FROM SESSION
                                                 where token = ? `, [
            token
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return row["updatedAt"];

            }
        }
    }

    /**
     * Met à jour le champ updatedAt de la dernière session
     * @param options
     */
    async updateHourOfSession(options: SessionModel): Promise<SessionModel | LogError> {
        try {
            let actualDate = new Date();
            const res = await this.connection.execute(`UPDATE SESSION
                                                       SET updatedAt = ?
                                                       WHERE token = ?`, [
                actualDate,
                options.token
            ]);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getSessionByToken(options.token as string);
            }
            return new LogError({numError: 400, text: "The session update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The session update failed"});
        }
    }

}