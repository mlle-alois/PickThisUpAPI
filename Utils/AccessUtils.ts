import {DatabaseUtils} from "../database/database";
import {SessionController, UserController} from "../controllers";
import express from "express";
import {LogError, SessionModel} from "../models";
import {DateUtils} from "./DateUtils";
import {ADMIN_USER_TYPE_ID, BLOCKED_USER_USER_TYPE_ID, DEV_USER_TYPE_ID, SUPER_ADMIN_USER_TYPE_ID} from "../consts";

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
 * récupération du mail de l'utilisateur connecté
 * @param req
 */
export async function getUserMailConnected(req: express.Request): Promise<string | LogError> {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await DatabaseUtils.getConnection();
        const sessionController = new SessionController(connection);
        const session = await sessionController.getSessionByToken(token);
        if (session instanceof LogError)
            return session;

        return session.userId;
    }
    return new LogError({numError: 404, text: "User id not found"});
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

/**
 * Le token renseigné correspond à un DEVELOPPEUR
 * @param req
 */
export async function isDevConnected(req: express.Request): Promise<boolean> {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await DatabaseUtils.getConnection();
        const sessionController = new SessionController(connection);
        const userController = new UserController(connection);

        const session = await sessionController.getSessionByToken(token);
        if (session instanceof LogError)
            return false;

        const user = await userController.getUserByMail(session.userId);
        if (user instanceof LogError)
            return false;

        if (user.typeId === DEV_USER_TYPE_ID) {
            return true;
        }
    }
    return false;
}

/**
 * Le token renseigné correspond à un ADMINISTRATEUR ou SUPER ADMINISTRATEUR ou DEVELOPPEUR
 * @param req
 */
export async function isAdministratorConnected(req: express.Request): Promise<boolean> {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await DatabaseUtils.getConnection();
        const sessionController = new SessionController(connection);
        const userController = new UserController(connection);

        const session = await sessionController.getSessionByToken(token);
        if (session instanceof LogError)
            return false;

        const user = await userController.getUserByMail(session.userId);
        if (user instanceof LogError)
            return false;

        if (user.typeId === DEV_USER_TYPE_ID || user.typeId === SUPER_ADMIN_USER_TYPE_ID
            || user.typeId === ADMIN_USER_TYPE_ID) {
            return true;
        }
    }
    return false;
}

/**
 * Le token renseigné correspond à un UTILISATEUR BLOQUE
 * @param req
 */
export async function isBlockedUserConnected(req: express.Request): Promise<boolean> {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await DatabaseUtils.getConnection();
        const sessionController = new SessionController(connection);
        const userController = new UserController(connection);

        const session = await sessionController.getSessionByToken(token);
        if (session instanceof LogError)
            return false;

        const user = await userController.getUserByMail(session.userId);
        if (user instanceof LogError)
            return false;

        if (user.typeId === BLOCKED_USER_USER_TYPE_ID) {
            return true;
        }
    }
    return false;
}
