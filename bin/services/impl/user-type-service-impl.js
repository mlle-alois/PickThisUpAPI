"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypeServiceImpl = void 0;
const controllers_1 = require("../../controllers");
class UserTypeServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.userTypeController = new controllers_1.UserTypeController(this.connection);
    }
    getUserTypeById(userTypeId) {
        return this.userTypeController.getUserTypeById(userTypeId);
    }
    async getAllUsersTypes(options) {
        return this.userTypeController.getUserTypes(options);
    }
}
exports.UserTypeServiceImpl = UserTypeServiceImpl;
//# sourceMappingURL=user-type-service-impl.js.map