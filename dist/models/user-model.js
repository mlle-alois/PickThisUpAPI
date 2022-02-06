"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
class UserModel {
    constructor(properties) {
        this.mail = properties === null || properties === void 0 ? void 0 : properties.mail;
        this.password = properties === null || properties === void 0 ? void 0 : properties.password;
        this.name = properties === null || properties === void 0 ? void 0 : properties.name;
        this.firstname = properties === null || properties === void 0 ? void 0 : properties.firstname;
        this.phoneNumber = properties === null || properties === void 0 ? void 0 : properties.phoneNumber;
        this.profilePictureId = properties === null || properties === void 0 ? void 0 : properties.profilePictureId;
        this.profilePicture = properties.profilePicture;
        this.typeId = properties === null || properties === void 0 ? void 0 : properties.typeId;
        this.type = properties.type;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user-model.js.map