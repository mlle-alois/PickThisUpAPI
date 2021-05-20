import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {isDevConnected} from "../Utils";
import {BoardServiceImpl, TaskServiceImpl, UserServiceImpl} from "../services/impl";
import {LogError} from "../models";
import {taskRouter} from "./task-router";

const userRouter = express.Router();

/**
 * récupération des développeurs
 * URL : /user/getAllDevelopers?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getAllDevelopers", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
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
});


/**
 * récupération de
 * URL : /user/getUserByToken/:token
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getUserByToken/:token", authUserMiddleWare, async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userService = new UserServiceImpl(connection);

    const token = req.params.token;

    if(token === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const user = await userService.getUserByToken(token);

    if (user instanceof LogError)
        LogError.HandleStatus(res, user);
    else
        res.json(user);
});

export {
    userRouter
}