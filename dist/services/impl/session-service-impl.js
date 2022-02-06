"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionServiceImpl = void 0;
const controllers_1 = require("../../controllers");
class SessionServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.userController = new controllers_1.UserController(this.connection);
        this.authController = new controllers_1.AuthController(this.connection);
        this.sessionController = new controllers_1.SessionController(this.connection);
    }
    async getMaxSessionId() {
        return this.sessionController.getMaxSessionId();
    }
    async getSessionByToken(token) {
        return this.sessionController.getSessionByToken(token);
    }
    async createSession(sessionId, token, mail) {
        return this.sessionController.createSession(sessionId, token, mail);
    }
    async deleteOldSessionsByUserId(mail) {
        return this.sessionController.deleteOldSessionsByUserMail(mail);
    }
    async deleteSessionByToken(token) {
        return this.sessionController.deleteSessionByToken(token);
    }
    async getLastUpdatedTimePlus2Hours(token) {
        return this.sessionController.getLastUpdatedTimePlus2Hours(token);
    }
    async updateSession(options) {
        return this.sessionController.updateHourOfSession(options);
    }
}
exports.SessionServiceImpl = SessionServiceImpl;
//# sourceMappingURL=session-service-impl.js.map