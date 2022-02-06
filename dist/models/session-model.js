"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
class SessionModel {
    constructor(properties) {
        this.sessionId = properties.sessionId;
        this.token = properties.token;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
        this.deletedAt = properties.deletedAt;
        this.userId = properties.userId;
    }
}
exports.SessionModel = SessionModel;
//# sourceMappingURL=session-model.js.map