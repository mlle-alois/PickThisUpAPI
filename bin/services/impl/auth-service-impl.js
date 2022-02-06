"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceImpl = void 0;
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const bcrypt_1 = require("bcrypt");
const controllers_2 = require("../../controllers");
const user_service_impl_1 = require("./user-service-impl");
class AuthServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
        this.authController = new controllers_1.AuthController(this.connection);
        this.sessionController = new controllers_1.SessionController(this.connection);
        this.userTypeController = new controllers_2.UserTypeController(this.connection);
    }
    async subscribe(properties) {
        const user = await this.userService.getUserByMail(properties.userMail);
        if (!(user instanceof models_1.LogError))
            return new models_1.LogError({ numError: 409, text: "Mail is already used" });
        const typeUser = await this.userTypeController.getUserTypeById(properties.userTypeId);
        if (typeUser instanceof models_1.LogError) {
            return new models_1.LogError({ numError: 400, text: "User type don't exists" });
        }
        properties.userPassword = await (0, bcrypt_1.hash)(properties.userPassword, 5);
        return this.authController.createUser(properties);
    }
    async login(mail, password) {
        const user = await this.userService.getUserByMailAndPassword(mail, password);
        if (user instanceof models_1.LogError)
            return user;
        let token = await (0, bcrypt_1.hash)(Date.now() + mail, 5);
        token = token.replace('/', '');
        try {
            await this.sessionController.deleteOldSessionsByUserMail(mail);
            return await this.sessionController.createSession(await this.sessionController.getMaxSessionId() + 1, token, mail);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Connection failed" });
        }
    }
}
exports.AuthServiceImpl = AuthServiceImpl;
//# sourceMappingURL=auth-service-impl.js.map