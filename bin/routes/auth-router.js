"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const Utils_1 = require("../Utils");
const authRouter = express_1.default.Router();
exports.authRouter = authRouter;
authRouter.post("/subscribe", async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
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
        const authService = new impl_1.AuthServiceImpl(connection);
        const user = await authService.subscribe({
            userMail: mail,
            userPassword: password,
            userName: name,
            userFirstname: firstname,
            userPhoneNumber: phoneNumber,
            userTypeId: typeId
        });
        if (user instanceof models_1.LogError)
            return models_1.LogError.HandleStatus(res, user);
        const session = await authService.login(mail, password);
        if (session instanceof models_1.LogError) {
            models_1.LogError.HandleStatus(res, session);
        }
        else {
            res.status(201);
            res.json({ user, session });
        }
    }
    catch (err) {
        next(err);
    }
});
authRouter.post("/login", async function (req, res, next) {
    try {
        const mail = req.body.mail;
        const password = req.body.password;
        if (mail === undefined || password === undefined) {
            res.status(400).end();
            return;
        }
        const connection = await database_1.DatabaseUtils.getConnection();
        const authService = new impl_1.AuthServiceImpl(connection);
        const session = await authService.login(mail, password);
        if (session instanceof models_1.LogError) {
            return models_1.LogError.HandleStatus(res, session);
        }
        else {
            res.json(session);
        }
    }
    catch (err) {
        next(err);
    }
});
authRouter.get("/forgot-password", async function (req, res, next) {
    try {
        const mail = req.query.mail;
        if (mail === undefined) {
            res.status(400).end();
            return;
        }
        const connection = await database_1.DatabaseUtils.getConnection();
        const userService = new impl_1.UserServiceImpl(connection);
        const user = await userService.getUserByMail(mail);
        if (user instanceof models_1.LogError) {
            return models_1.LogError.HandleStatus(res, user);
        }
        else {
            res.json(user);
        }
    }
    catch (err) {
        next(err);
    }
});
authRouter.delete("/logout", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const sessionService = new impl_1.SessionServiceImpl(connection);
        const token = (0, Utils_1.getAuthorizedToken)(req);
        if (token === "") {
            res.status(400).end;
        }
        const success = await sessionService.deleteSessionByToken(token);
        if (success) {
            res.status(204).end();
        }
        else {
            res.status(404).end();
        }
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=auth-router.js.map