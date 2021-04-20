import {DatabaseUtils} from "../database/database";
import {SessionController, UserController} from "../controllers";
import express from "express";
import {SessionModel} from "../models";
import {DateUtils} from "./DateUtils";

/**
 * Récupération du token autorisé/connecté
 * @param req
 */
export function getAuthorizedToken(req: express.Request): string {
    const auth = req.headers['authorization'];
    if (auth !== undefined) {
        //récupération du token autorisé
        return auth.slice(7);
    }
    return "";
}

/**
 * Le token renseigné correspond à l'utilisateur concerné par la modification ou à un ADMIN
 * @param userId
 * @param req
 */
export async function isConcernedUserConnected(userId: number | undefined, req: express.Request): Promise<boolean> {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await DatabaseUtils.getConnection();
        const sessionController = new SessionController(connection);
        const session = await sessionController.getSessionByToken(token);
        if (session !== null) {
            if (session.userId != null) {
                if (session.userId === userId) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * récupération de l'id de l'utilisateur connecté
 * @param req
 */
export async function getUserIdConnected(req: express.Request): Promise<number | undefined> {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await DatabaseUtils.getConnection();
        const sessionController = new SessionController(connection);
        const session = await sessionController.getSessionByToken(token);
        if (session !== null) {
            return session.userId;
        }
    }
    return undefined;
}

/**
 * Vrai s'il le token à dépassé le nombre d'heure autorisées
 * @param session
 * @param hours
 * @constructor
 */
export function isTokenExpired(session: SessionModel, hours: number): boolean {
    let actualDate = new Date();
    DateUtils.addXHoursToDate(session.updatedAt, hours);
    return actualDate > session.updatedAt;
}
