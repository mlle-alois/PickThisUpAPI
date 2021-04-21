import express from "express";
import {DatabaseUtils} from "../database/database";
import {SessionController} from "../controllers";
import {getAuthorizedToken, isTokenExpired} from "../Utils";
import {LogError, SessionModel} from "../models";

/**
 * vérification qu'un utilisateur est connecté
 * ATTENTION : Cette fonction ne vérifie pas les droits d'accès
 * @param req
 * @param res
 * @param next
 */
export async function authUserMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await DatabaseUtils.getConnection();
        const sessionController = new SessionController(connection);
        const session = await sessionController.getSessionByToken(token);

        if (session instanceof LogError)
            return LogError.HandleStatus(res, session);

        // check si expiré
        if (isTokenExpired(session, 2)) {
            // Si oui DELETE
            if (await sessionController.deleteSessionByToken(token)) {
                LogError.HandleStatus(res, {
                    numError: 408,
                    text: "Session expirée"
                });
                return;
            }
        }
        await sessionController.updateHourOfSession(session as SessionModel);
        next();
        return;
    } else {
        LogError.HandleStatus(res, {
            numError: 401,
            text: "Authentification nécessaire à l'accès"
        });
    }
}
