"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const models_1 = require("../models");
const user_controller_1 = require("./user-controller");
const session_controller_1 = require("./session-controller");
class AuthController {
    constructor(connection) {
        this.connection = connection;
        this.userController = new user_controller_1.UserController(this.connection);
        this.sessionController = new session_controller_1.SessionController(this.connection);
    }
    async createUser(properties) {
        try {
            await this.connection.execute(`INSERT INTO ${user_controller_1.UserController.userTable} (user_mail, user_password, user_name, user_firstname,
                                                             user_phone_number, user_type_id)
                                           VALUES (?, ?, ?, ?, ?, ?)`, [
                properties.userMail,
                properties.userPassword,
                properties.userName,
                properties.userFirstname,
                properties.userPhoneNumber,
                properties.userTypeId
            ]);
            return await this.userController.getUserByMail(properties.userMail);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during creation" });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth-controller.js.map