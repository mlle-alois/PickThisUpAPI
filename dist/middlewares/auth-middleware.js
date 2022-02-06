"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserMiddleWare = void 0;
const database_1 = require("../database/database");
const controllers_1 = require("../controllers");
const Utils_1 = require("../Utils");
const models_1 = require("../models");
async function authUserMiddleWare(req, res, next) {
    const token = (0, Utils_1.getAuthorizedToken)(req);
    if (token !== "") {
        const connection = await database_1.DatabaseUtils.getConnection();
        const sessionController = new controllers_1.SessionController(connection);
        const session = await sessionController.getSessionByToken(token);
        if (session instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, session);
        if ((0, Utils_1.isTokenExpired)(session, 2)) {
            if (await sessionController.deleteSessionByToken(token)) {
                models_1.LogError.HandleStatus(res, {
                    numError: 408,
                    text: "Session expirée"
                });
                return;
            }
        }
        await sessionController.updateHourOfSession(session);
        next();
        return;
    }
    else {
        models_1.LogError.HandleStatus(res, {
            numError: 401,
            text: "Authentification nécessaire à l'accès"
        });
    }
}
exports.authUserMiddleWare = authUserMiddleWare;
//# sourceMappingURL=auth-middleware.js.map