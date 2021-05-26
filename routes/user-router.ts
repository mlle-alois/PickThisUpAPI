import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {getUserMailConnected, isAdministratorConnected, isBlockedUserConnected, isDevConnected} from "../Utils";
import {UserServiceImpl} from "../services/impl";
import {LogError} from "../models";

const userRouter = express.Router();

/**
 * récupération des développeurs
 * URL : /user/getAllDevelopers?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getAllDevelopers", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const userService = new UserServiceImpl(connection);

            const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

            const developers = await userService.getAllDevelopers({
                limit,
                offset
            });
            res.json(developers);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});


/**
 * récupération de
 * URL : /user/getUserByToken/:token
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getUserByToken/:token", authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await DatabaseUtils.getConnection();
        const userService = new UserServiceImpl(connection);

        const token = req.params.token;

        if (token === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const user = await userService.getUserByToken(token);

        if (user instanceof LogError)
            LogError.HandleStatus(res, user);
        else
            res.json(user);
    } catch (err) {
        next(err);
    }
});

/**
 * modification d'un user selon son mail
 * URL : /user/update/:mail
 * Requete : PUT
 * ACCES : ADMIN ou SUPER ADMIN ou DEV ou USER CONNECTE
 * Nécessite d'être connecté : OUI
 */
userRouter.put("/update/:mail", authUserMiddleWare, async function (req, res, next) {
    try {
        const mail = req.params.mail;

        if (!await isAdministratorConnected(req) && mail !== await getUserMailConnected(req))
            return res.status(403).end();

        const password = req.body.password;
        const name = req.body.name;
        const firstname = req.body.firstname;
        const phone = req.body.phone;

        if (mail === undefined || (password === undefined && name === undefined && firstname === undefined && phone === undefined))
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const connection = await DatabaseUtils.getConnection();
        const userService = new UserServiceImpl(connection);

        const user = await userService.updateUser({
            mail: mail,
            password: password,
            name: name,
            firstname: firstname,
            phoneNumber: phone
        });

        if (user instanceof LogError)
            LogError.HandleStatus(res, user);
        else
            res.json(user);
    } catch (err) {
        next(err);
    }
});

export {
    userRouter
}