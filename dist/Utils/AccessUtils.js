"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlockedUserConnected = exports.isAdministratorConnected = exports.isDevConnected = exports.isTokenExpired = exports.getUserMailConnected = exports.getAuthorizedToken = void 0;
const database_1 = require("../database/database");
const controllers_1 = require("../controllers");
const models_1 = require("../models");
const DateUtils_1 = require("./DateUtils");
const consts_1 = require("../consts");
function getAuthorizedToken(req) {
    const auth = req.headers['authorization'];
    if (auth !== undefined) {
        return auth.slice(7);
    }
    return "";
}
exports.getAuthorizedToken = getAuthorizedToken;
async function getUserMailConnected(req) {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await database_1.DatabaseUtils.getConnection();
        const sessionController = new controllers_1.SessionController(connection);
        const session = await sessionController.getSessionByToken(token);
        if (session instanceof models_1.LogError)
            return session;
        return session.userId;
    }
    return new models_1.LogError({ numError: 404, text: "User id not found" });
}
exports.getUserMailConnected = getUserMailConnected;
function isTokenExpired(session, hours) {
    let actualDate = new Date();
    DateUtils_1.DateUtils.addXHoursToDate(session.updatedAt, hours);
    return actualDate > session.updatedAt;
}
exports.isTokenExpired = isTokenExpired;
async function isDevConnected(req) {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await database_1.DatabaseUtils.getConnection();
        const sessionController = new controllers_1.SessionController(connection);
        const userController = new controllers_1.UserController(connection);
        const session = await sessionController.getSessionByToken(token);
        if (session instanceof models_1.LogError)
            return false;
        const user = await userController.getUserByMail(session.userId);
        if (user instanceof models_1.LogError)
            return false;
        if (user.typeId === consts_1.DEV_USER_TYPE_ID) {
            return true;
        }
    }
    return false;
}
exports.isDevConnected = isDevConnected;
async function isAdministratorConnected(req) {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await database_1.DatabaseUtils.getConnection();
        const sessionController = new controllers_1.SessionController(connection);
        const userController = new controllers_1.UserController(connection);
        const session = await sessionController.getSessionByToken(token);
        if (session instanceof models_1.LogError)
            return false;
        const user = await userController.getUserByMail(session.userId);
        if (user instanceof models_1.LogError)
            return false;
        if (user.typeId === consts_1.DEV_USER_TYPE_ID || user.typeId === consts_1.SUPER_ADMIN_USER_TYPE_ID
            || user.typeId === consts_1.ADMIN_USER_TYPE_ID) {
            return true;
        }
    }
    return false;
}
exports.isAdministratorConnected = isAdministratorConnected;
async function isBlockedUserConnected(req) {
    const token = getAuthorizedToken(req);
    if (token !== "") {
        const connection = await database_1.DatabaseUtils.getConnection();
        const sessionController = new controllers_1.SessionController(connection);
        const userController = new controllers_1.UserController(connection);
        const session = await sessionController.getSessionByToken(token);
        if (session instanceof models_1.LogError)
            return false;
        const user = await userController.getUserByMail(session.userId);
        if (user instanceof models_1.LogError)
            return false;
        if (user.typeId === consts_1.BLOCKED_USER_USER_TYPE_ID) {
            return true;
        }
    }
    return false;
}
exports.isBlockedUserConnected = isBlockedUserConnected;
//# sourceMappingURL=AccessUtils.js.map