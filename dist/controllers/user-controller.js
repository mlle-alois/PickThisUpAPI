"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const models_1 = require("../models");
const bcrypt_1 = require("bcrypt");
class UserController {
    constructor(connection) {
        this.connection = connection;
    }
    async getAllUsers(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM ${UserController.userTable}
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ${UserController.userTable}.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ${UserController.userTable}.user_type_id LIMIT ?, ?`, [
            offset,
            limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new models_1.MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new models_1.UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            });
        }
        return [];
    }
    async getUserByMail(mail) {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM ${UserController.userTable}
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ${UserController.userTable}.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ${UserController.userTable}.user_type_id
                                                 where user_mail = ?`, [
            mail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new models_1.MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new models_1.UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "User not found" });
    }
    async getUserByMailAndPassword(mail, password) {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM ${UserController.userTable}
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ${UserController.userTable}.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ${UserController.userTable}.user_type_id
                                                 where user_mail = ?`, [
            mail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                const isSamePassword = await (0, bcrypt_1.compare)(password, row["user_password"]);
                if (!isSamePassword) {
                    return new models_1.LogError({ numError: 409, text: "Incorrect mail or password" });
                }
                return new models_1.UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new models_1.MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new models_1.UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "User nor found" });
    }
    async getAllDevelopers(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM ${UserController.userTable}
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ${UserController.userTable}.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ${UserController.userTable}.user_type_id
                                                 WHERE ${UserController.userTable}.user_type_id = 1 LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new models_1.MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new models_1.UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            });
        }
        return [];
    }
    async getUserByToken(token) {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM ${UserController.userTable}
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = ${UserController.userTable}.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = ${UserController.userTable}.user_type_id
                                                          JOIN SESSION on SESSION.user_id = ${UserController.userTable}.user_mail
                                                 where token = ?`, [
            token
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new models_1.MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new models_1.UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "User not found" });
    }
    async updateUser(options) {
        const setClause = [];
        const params = [];
        if (options.password === "") {
            options.password = undefined;
        }
        if (options.password !== undefined) {
            setClause.push("user_password = ?");
            const hachedPassword = await (0, bcrypt_1.hash)(options.password, 5);
            params.push(hachedPassword);
        }
        if (options.name !== undefined) {
            setClause.push("user_name = ?");
            params.push(options.name);
        }
        if (options.firstname !== undefined) {
            setClause.push("user_firstname = ?");
            params.push(options.firstname);
        }
        if (options.phoneNumber !== undefined) {
            setClause.push("user_phone_number = ?");
            params.push(options.phoneNumber);
        }
        if (options.typeId !== undefined) {
            setClause.push("user_type_id = ?");
            params.push(options.typeId);
        }
        params.push(options.mail);
        try {
            const res = await this.connection.execute(`UPDATE ${UserController.userTable} SET ${setClause.join(", ")} WHERE user_mail = ?`, params);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getUserByMail(options.mail);
            }
            return new models_1.LogError({ numError: 400, text: "The user update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The user update failed" });
        }
    }
    async updateUserStatus(mail, status) {
        const setClause = [];
        const params = [];
        if (status !== undefined) {
            setClause.push("status = ?");
            params.push(status);
        }
        params.push(mail);
        try {
            const res = await this.connection.execute(`UPDATE ${UserController.userTable} SET ${setClause.join(", ")} WHERE user_mail = ?`, params);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getUserByMail(mail);
            }
            return new models_1.LogError({ numError: 400, text: "The user update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The user update failed" });
        }
    }
    async deleteUserByMail(mail) {
        try {
            const res = await this.connection.query(`DELETE FROM ${UserController.userTable} WHERE user_mail = "${mail}"`);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}
exports.UserController = UserController;
UserController.userTable = "my_user";
//# sourceMappingURL=user-controller.js.map