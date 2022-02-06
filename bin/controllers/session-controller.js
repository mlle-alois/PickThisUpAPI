"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const user_controller_1 = require("./user-controller");
const models_1 = require("../models");
class SessionController {
    constructor(connection) {
        this.connection = connection;
        this.userController = new user_controller_1.UserController(this.connection);
    }
    async getMaxSessionId() {
        const res = await this.connection.query('SELECT MAX(session_id) as maxId FROM SESSION');
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
    async getSessionByToken(token) {
        const res = await this.connection.query(`SELECT session_id, token, createdAt, updatedAt, deletedAt, user_id
                                                 FROM SESSION
                                                 where token = ? `, [
            token
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.SessionModel({
                    sessionId: Number.parseInt(row["session_id"]),
                    token: row["token"],
                    createdAt: row["createdAt"],
                    updatedAt: row["updatedAt"],
                    deletedAt: row["deletedAt"],
                    userId: row["user_id"]
                });
            }
        }
        return new models_1.LogError({ numError: 403, text: "Session not found, access denied" });
    }
    async createSession(sessionId, token, mail) {
        try {
            await this.connection.execute(`INSERT INTO SESSION (session_id, token, createdAt, updatedAt, user_id)
                                           VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)`, [
                sessionId,
                token,
                mail
            ]);
            return await this.getSessionByToken(token);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during session creation" });
        }
    }
    async deleteOldSessionsByUserMail(mail) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM SESSION
                                                     WHERE user_id = ?`, [
                mail
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async deleteSessionByToken(token) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM SESSION
                                                     WHERE token = ?`, [
                token
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async getLastUpdatedTimePlus2Hours(token) {
        const res = await this.connection.query(`SELECT (updatedAt + INTERVAL '2' HOUR) as updatedAt
                                                 FROM SESSION
                                                 where token = ? `, [
            token
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return row["updatedAt"];
            }
        }
    }
    async updateHourOfSession(options) {
        try {
            let actualDate = new Date();
            const res = await this.connection.execute(`UPDATE SESSION
                                                       SET updatedAt = ?
                                                       WHERE token = ?`, [
                actualDate,
                options.token
            ]);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getSessionByToken(options.token);
            }
            return new models_1.LogError({ numError: 400, text: "The session update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The session update failed" });
        }
    }
}
exports.SessionController = SessionController;
//# sourceMappingURL=session-controller.js.map