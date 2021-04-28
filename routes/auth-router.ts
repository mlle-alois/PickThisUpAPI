import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {AuthController} from "../controllers";
import {SessionController} from "../controllers";
import {AuthServiceImpl} from "../services/impl/auth-service-impl";
import {SessionServiceImpl} from "../services/impl/session-service-impl";
import {LogError} from "../models";
import {getAuthorizedToken} from "../Utils";
import {UserServiceImpl} from "../services/impl";

const authRouter = express.Router();

/**
 * inscription d'un utilisateur
 * URL : auth/subscribe
 * Requete : POST
 * ACCES : Tous
 * Nécessite d'être connecté : NON
 */
authRouter.post("/subscribe", async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const mail = req.body.mail;
    const password = req.body.password;
    const name = req.body.name;
    const firstname = req.body.firstname;
    const phoneNumber = req.body.phoneNumber;
    const typeId = req.body.typeId;

    if (mail === undefined || password === undefined || name === undefined ||
        firstname === undefined || phoneNumber === undefined || typeId === undefined) {
        res.status(400).end();
        return;
    }

    const authService = new AuthServiceImpl(connection);

    const user = await authService.subscribe({
        userMail: mail,
        userPassword: password,
        userName: name,
        userFirstname: firstname,
        userPhoneNumber: phoneNumber,
        userTypeId: typeId
    });

    if (user instanceof LogError)
        return LogError.HandleStatus(res, user);

    const session = await authService.login(mail, password);
    if (session instanceof LogError) {
        LogError.HandleStatus(res, session);
    } else {
        res.status(201);
        res.json({user, session});
    }
});

/**
 * connexion d'un utilisateur
 * URL : auth/login
 * Requete : POST
 * ACCES : Tous
 * Nécessite d'être connecté : NON
 */
authRouter.post("/login", async function (req, res) {
    const mail = req.body.mail;
    const password = req.body.password;
    if (mail === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const connection = await DatabaseUtils.getConnection();
    const authService = new AuthServiceImpl(connection);

    const session = await authService.login(mail, password);
    if(session instanceof LogError) {
        return LogError.HandleStatus(res, session);
    } else {
        res.json(session);
    }
});

/**
 * récupération d'un utilisateur selon son mail (pour pouvoir réinitialiser son mot de passe s'il existe)
 * URL : auth/forgot-password?mail={x}
 * Requete : GET
 * ACCES : Tous
 * Nécessite d'être connecté : NON
 */
authRouter.get("/forgot-password", async function (req, res) {
    //TODO récupérer via le body possible ?
    const mail = req.query.mail as string;
    if (mail === undefined) {
        res.status(400).end();
        return;
    }
    const connection = await DatabaseUtils.getConnection();
    const userService = new UserServiceImpl(connection);

    const user = await userService.getUserByMail(mail);
    if(user instanceof LogError) {
        return LogError.HandleStatus(res, user);
    } else {
        res.json(user);
    }
});

/**
 * déconnexion d'un utilisateur
 * URL : auth/logout
 * Requete : DELETE
 * ACCES : Tous
 * Nécessite d'être connecté : OUI
 */
authRouter.delete("/logout", authUserMiddleWare, async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const sessionService = new SessionServiceImpl(connection);
    const token = getAuthorizedToken(req);
    if(token === "") {
        res.status(400).end;
    }
    //suppression
    const success = await sessionService.deleteSessionByToken(token);
    if (success) {
        // pas de contenu mais a fonctionné
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

export {
    authRouter
}