import {LogError, MediaModel, UserModel, UserTypeModel} from "../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {compare, hash} from 'bcrypt';
import {TaskGetAllOptions} from "./task-controller";

export interface UserGetAllOptions {
    limit?: number;
    offset?: number;
}

interface UserUpdateOptions {
    mail: string;
    password?: string;
    name?: string;
    firstname?: string;
    phoneNumber?: string;
    profilePictureId?: number;
    typeId?: number;
}

export class UserController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Récupération de tous les utilisateurs
     * @param options -> Limit et offset de la requete
     */
    async getAllUsers(options?: UserGetAllOptions): Promise<UserModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM USER
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = USER.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = USER.user_type_id LIMIT ?, ?`, [
            offset,
            limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            });
        }
        return [];
    }

    /**
     * Récupération d'un utilisateur depuis son :
     * @param mail
     */
    async getUserByMail(mail: string): Promise<UserModel | LogError> {
        //récupération de l'utilisateur
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM USER
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = USER.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = USER.user_type_id
                                                 where user_mail = ?`, [
            mail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            }
        }
        return new LogError({numError: 404, text: "User not found"});
    }

    /**
     * Récupération d'un utilisateur via :
     * @param mail
     * @param password -> non haché
     */
    async getUserByMailAndPassword(mail: string, password: string): Promise<UserModel | LogError> {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM USER
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = USER.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = USER.user_type_id
                                                 where user_mail = ?`, [
            mail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                const isSamePassword = await compare(password, row["user_password"]);
                if (!isSamePassword) {
                    return new LogError({numError: 409, text: "Incorrect mail or password"});
                }
                return new UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            }
        }
        return new LogError({numError: 404, text: "User nor found"});
    }

    /**
     * récupération de tous les développeurs
     * @param options
     */
    async getAllDevelopers(options?: TaskGetAllOptions): Promise<UserModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM USER
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = USER.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = USER.user_type_id
                                                 WHERE USER.user_type_id = 1 LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            });
        }
        return [];
    }

    /**
     * Récupération d'un utilisateur depuis son :
     * @param token
     */
    async getUserByToken(token: string): Promise<UserModel | LogError> {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        media_path,
                                                        USER_TYPE.user_type_id,
                                                        user_type_libelle
                                                 FROM USER
                                                          LEFT JOIN MEDIA ON MEDIA.media_id = USER.profile_picture_id
                                                          JOIN USER_TYPE ON USER_TYPE.user_type_id = USER.user_type_id
                                                          JOIN SESSION on SESSION.user_id = USER.user_mail
                                                 where token = ?`, [
            token
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    profilePicture: new MediaModel({
                        mediaId: row["profile_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    typeId: row["user_type_id"],
                    type: new UserTypeModel({
                        userTypeId: row["user_type_id"],
                        userTypeLibelle: row["user_type_libelle"]
                    })
                });
            }
        }
        return new LogError({numError: 404, text: "User not found"});
    }

    /**
     * Modification des informations d'un utilisateur renseignées dans les options
     * @param options -> informations à modifier
     */
    async updateUser(options: UserUpdateOptions): Promise<UserModel | LogError> {
        const setClause: string[] = [];
        const params = [];

        if(options.password === "") {
            options.password = undefined;
        }
        if (options.password !== undefined) {
            setClause.push("user_password = ?");
            const hachedPassword = await hash(options.password, 5);
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
            const res = await this.connection.execute(`UPDATE USER SET ${setClause.join(", ")} WHERE user_mail = ?`, params);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getUserByMail(options.mail);
            }
            return new LogError({numError: 400, text: "The user update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The user update failed"});
        }
    }

    /**
     * Modification du statut d'un utilisateur renseignées dans les paramètres
     * @param mail
     * @param status
     */
    async updateUserStatus(mail:string, status:number): Promise<UserModel | LogError> {
        const setClause: string[] = [];
        const params = [];


        if (status !== undefined) {
            setClause.push("status = ?");
            params.push(status);

        }
        params.push(mail);
        try {
            const res = await this.connection.execute(`UPDATE USER SET ${setClause.join(", ")} WHERE user_mail = ?`, params);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getUserByMail(mail);
            }
            return new LogError({numError: 400, text: "The user update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The user update failed"});
        }
    }

    /**
     * Suppression d'un utilisateur depuis son :
     * @param userId
     */
    async deleteUserByMail(mail: string): Promise<boolean> {
        try {
            const res = await this.connection.query(`DELETE FROM USER WHERE user_mail = "${mail}"`);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
