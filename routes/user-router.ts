import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {getUserMailConnected, isAdministratorConnected, isDevConnected} from "../Utils";
import {TaskServiceImpl, UserServiceImpl, UserTypeServiceImpl} from "../services/impl";
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
 * récupération des développeurs
 * URL : /user/getAllUsers?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getAllUsers", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const userService = new UserServiceImpl(connection);

            const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

            const developers = await userService.getAllUsers({
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
 * récupération des développeurs
 * URL : /user/getAllUsers?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.get("/getAllTypes", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const userTypeService = new UserTypeServiceImpl(connection);

            const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

            const developers = await userTypeService.getAllUsersTypes({
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
        const typeId = req.body.typeId;

        if (mail === undefined || (password === undefined && name === undefined && firstname === undefined && phone === undefined && typeId === undefined))
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const connection = await DatabaseUtils.getConnection();
        const userService = new UserServiceImpl(connection);

        const user = await userService.updateUser({
            mail: mail,
            password: password,
            name: name,
            firstname: firstname,
            phoneNumber: phone,
            typeId: typeId
        });

        if (user instanceof LogError)
            LogError.HandleStatus(res, user);
        else
            res.json(user);
    } catch (err) {
        next(err);
    }
});

/**
 * suppression d'un user selon son mail
 * URL : /user/delete/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
userRouter.delete("/delete/:mail", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req) || await isAdministratorConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const userService = new UserServiceImpl(connection);

            const mail = req.params.mail;

            if (mail === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const success = await userService.deleteUserByMail(mail);
            if (success)
                res.status(204).end();
            else
                res.status(404).end();
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});


export {
    userRouter
}
