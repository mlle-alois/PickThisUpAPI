"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServiceImpl = void 0;
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const user_type_service_impl_1 = require("./user-type-service-impl");
class UserServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.userController = new controllers_1.UserController(this.connection);
        this.userTypeService = new user_type_service_impl_1.UserTypeServiceImpl(this.connection);
    }
    async getAllUsers(options) {
        return this.userController.getAllUsers(options);
    }
    getUserByMail(userId) {
        return this.userController.getUserByMail(userId);
    }
    getUserByMailAndPassword(mail, password) {
        return this.userController.getUserByMailAndPassword(mail, password);
    }
    async getAllDevelopers(options) {
        return await this.userController.getAllDevelopers(options);
    }
    getUserByToken(token) {
        return this.userController.getUserByToken(token);
    }
    async updateUser(options) {
        const user = await this.userController.getUserByMail(options.mail);
        if (user instanceof models_1.LogError)
            return user;
        return await this.userController.updateUser(options);
    }
    async updateUserStatus(mail, status) {
        const user = await this.userController.getUserByMail(mail);
        if (user instanceof models_1.LogError)
            return user;
        return await this.userController.updateUserStatus(mail, status);
    }
    async deleteUserByMail(mail) {
        const user = await this.userController.getUserByMail(mail);
        if (user instanceof models_1.LogError)
            return false;
        return await this.userController.deleteUserByMail(mail);
    }
}
exports.UserServiceImpl = UserServiceImpl;
//# sourceMappingURL=user-service-impl.js.map