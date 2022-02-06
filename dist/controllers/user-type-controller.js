"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypeController = void 0;
const models_1 = require("../models");
class UserTypeController {
    constructor(connection) {
        this.connection = connection;
    }
    async getUserTypeById(userTypeId) {
        const res = await this.connection.query(`SELECT user_type_id,
                                                        user_type_libelle
                                                 FROM USER_TYPE
                                                 where user_type_id = ?`, [
            userTypeId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.UserTypeModel({
                    userTypeId: row["user_type_id"],
                    userTypeLibelle: row["user_type_libelle"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "User type not found" });
    }
    async getUserTypes(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT user_type_id,
                                                        user_type_libelle
                                                 FROM USER_TYPE
                                                 LIMIT ?, ?`, [
            offset,
            limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.UserTypeModel({
                    userTypeId: row["user_type_id"],
                    userTypeLibelle: row["user_type_libelle"]
                });
            });
        }
        return [];
    }
}
exports.UserTypeController = UserTypeController;
//# sourceMappingURL=user-type-controller.js.map