"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
var SessionModel = /** @class */ (function () {
    function SessionModel(properties) {
        this.sessionId = properties.sessionId;
        this.token = properties.token;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
        this.deletedAt = properties.deletedAt;
        this.userId = properties.userId;
    }
    return SessionModel;
}());
exports.SessionModel = SessionModel;
