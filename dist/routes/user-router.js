"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const Utils_1 = require("../Utils");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.get("/getAllDevelopers", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const userService = new impl_1.UserServiceImpl(connection);
            const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
            const developers = await userService.getAllDevelopers({
                limit,
                offset
            });
            res.json(developers);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
userRouter.get("/getAllUsers", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const userService = new impl_1.UserServiceImpl(connection);
            const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
            const developers = await userService.getAllUsers({
                limit,
                offset
            });
            res.json(developers);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
userRouter.get("/getAllTypes", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const userTypeService = new impl_1.UserTypeServiceImpl(connection);
            const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
            const developers = await userTypeService.getAllUsersTypes({
                limit,
                offset
            });
            res.json(developers);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
userRouter.get("/getUserByToken/:token", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const userService = new impl_1.UserServiceImpl(connection);
        const token = req.params.token;
        if (token === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const user = await userService.getUserByToken(token);
        if (user instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, user);
        else
            res.json(user);
    }
    catch (err) {
        next(err);
    }
});
userRouter.put("/update/:mail", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const mail = req.params.mail;
        if (!await (0, Utils_1.isAdministratorConnected)(req) && mail !== await (0, Utils_1.getUserMailConnected)(req))
            return res.status(403).end();
        const password = req.body.password;
        const name = req.body.name;
        const firstname = req.body.firstname;
        const phone = req.body.phone;
        const typeId = req.body.typeId;
        if (mail === undefined || (password === undefined && name === undefined && firstname === undefined && phone === undefined && typeId === undefined))
            return res.status(400).end("Veuillez renseigner les informations nécessaires");
        const connection = await database_1.DatabaseUtils.getConnection();
        const userService = new impl_1.UserServiceImpl(connection);
        const user = await userService.updateUser({
            mail: mail,
            password: password,
            name: name,
            firstname: firstname,
            phoneNumber: phone,
            typeId: typeId
        });
        if (user instanceof models_1.LogError)
            models_1.LogError.HandleStatus(res, user);
        else
            res.json(user);
    }
    catch (err) {
        next(err);
    }
});
userRouter.delete("/delete/:mail", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req) || await (0, Utils_1.isAdministratorConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const userService = new impl_1.UserServiceImpl(connection);
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
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=user-router.js.map