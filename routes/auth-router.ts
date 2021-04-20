import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {AuthController} from "../controllers";
import {SessionController} from "../controllers";
import {AuthServiceImpl} from "../services/impl/auth-service-impl";
import {SessionServiceImpl} from "../services/impl/session-service-impl";

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
        mail,
        password,
        name,
        firstname,
        phoneNumber,
        typeId
    });

    const session = await authService.login(mail, password);
    if (user !== null && session !== null) {
        res.status(201);
        res.json({user, session});
    } else {
        res.status(400).end();
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
    if(session === null) {
        res.status(404).end();
        return;
    } else {
        res.json(session);
    }
});

/**
 * déconnexion d'un utilisateur
 * URL : auth/logout?token=$2b$05$eiTDmmFGXYluk1RBXOKAD.r1GD8jT4naaeO5dL8D9ea/Jg//dVt6a
 * Requete : DELETE
 * ACCES : Tous
 * Nécessite d'être connecté : OUI
 */
authRouter.delete("/logout", authUserMiddleWare, async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const sessionService = new SessionServiceImpl(connection);
    const token = req.query.token ? req.query.token as string : "";
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