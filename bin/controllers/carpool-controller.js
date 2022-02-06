"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarpoolController = void 0;
const models_1 = require("../models");
const user_controller_1 = require("./user-controller");
class CarpoolController {
    constructor(connection) {
        this.connection = connection;
    }
    async getCarpoolById(carpoolId) {
        const res = await this.connection.query(`SELECT carpool_id,
                                                        carpool_departure_street,
                                                        carpool_departure_zipcode,
                                                        carpool_departure_city,
                                                        nb_places,
                                                        event_id,
                                                        conductor_id
                                                 FROM CARPOOL
                                                 where carpool_id = ?`, [
            carpoolId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.CarpoolModel({
                    carpoolId: row["carpool_id"],
                    carpoolDepartureStreet: row["carpool_departure_street"],
                    carpoolDepartureZipcode: row["carpool_departure_zipcode"],
                    carpoolDepartureCity: row["carpool_departure_city"],
                    nbPlaces: row["nb_places"],
                    eventId: row["event_id"],
                    conductorId: row["conductor_id"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "Carpool not found" });
    }
    async getMaxCarpoolId() {
        const res = await this.connection.query('SELECT MAX(carpool_id) as maxId FROM CARPOOL');
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                if (row["maxId"] === null) {
                    return 0;
                }
                else {
                    return row["maxId"];
                }
            }
        }
        return 0;
    }
    async createCarpool(options) {
        try {
            await this.connection.execute(`INSERT INTO CARPOOL (carpool_id,
                                                                carpool_departure_street,
                                                                carpool_departure_zipcode,
                                                                carpool_departure_city,
                                                                nb_places,
                                                                event_id,
                                                                conductor_id)
                                           VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                options.carpoolId,
                options.carpoolDepartureStreet,
                options.carpoolDepartureZipcode,
                options.carpoolDepartureCity,
                options.nbPlaces,
                options.eventId,
                options.conductorId
            ]);
            return await this.getCarpoolById(options.carpoolId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during carpool creation" });
        }
    }
    async deleteCarpoolsById(carpoolId) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM CARPOOL
                                                     WHERE carpool_id = ?`, [
                carpoolId
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async updateCarpool(options) {
        const setClause = [];
        const params = [];
        if (options.carpoolDepartureStreet !== undefined) {
            setClause.push("carpool_departure_street = ?");
            params.push(options.carpoolDepartureStreet);
        }
        if (options.carpoolDepartureZipcode !== undefined) {
            setClause.push("carpool_departure_zipcode = ?");
            params.push(options.carpoolDepartureZipcode);
        }
        if (options.carpoolDepartureCity !== undefined) {
            setClause.push("carpool_departure_city = ?");
            params.push(options.carpoolDepartureCity);
        }
        if (options.nbPlaces !== undefined) {
            setClause.push("nb_places = ?");
            params.push(options.nbPlaces);
        }
        params.push(options.carpoolId);
        try {
            const res = await this.connection.execute(`UPDATE CARPOOL SET ${setClause.join(", ")} WHERE carpool_id = ?`, params);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getCarpoolById(options.carpoolId);
            }
            return new models_1.LogError({ numError: 400, text: "The carpool update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The carpool update failed" });
        }
    }
    async registerCarpool(carpoolId, userMail) {
        try {
            await this.connection.execute(`INSERT INTO RESERVE_USER_CARPOOL (user_id, carpool_id)
                                           VALUES (?, ?)`, [
                userMail, carpoolId
            ]);
            return await this.getCarpoolMembersById(carpoolId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during registration" });
        }
    }
    async unregisterCarpool(carpoolId, userMail) {
        try {
            await this.connection.execute(`DELETE
                                           FROM RESERVE_USER_CARPOOL
                                           WHERE user_id = ?
                                             AND carpool_id = ?`, [
                userMail, carpoolId
            ]);
            return await this.getCarpoolMembersById(carpoolId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during unregistration" });
        }
    }
    async getCarpoolsByEvent(eventId) {
        const res = await this.connection.query(`SELECT CARPOOL.carpool_id,
                                                        carpool_departure_street,
                                                        carpool_departure_zipcode,
                                                        carpool_departure_city,
                                                        nb_places,
                                                        COALESCE(nb_places - COUNT(RUC.carpool_id), 0) as carpool_remaining_places,
                                                        event_id,
                                                        conductor_id,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number
                                                 FROM CARPOOL
                                                          JOIN ${user_controller_1.UserController.userTable} ON ${user_controller_1.UserController.userTable}.user_mail = CARPOOL.conductor_id
                                                          LEFT JOIN RESERVE_USER_CARPOOL RUC ON RUC.carpool_id = CARPOOL.carpool_id
                                                 WHERE CARPOOL.event_id = ?
                                                 GROUP BY CARPOOL.carpool_id`, [
            eventId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.CarpoolModel({
                    carpoolId: row["carpool_id"],
                    carpoolDepartureStreet: row["carpool_departure_street"],
                    carpoolDepartureZipcode: row["carpool_departure_zipcode"],
                    carpoolDepartureCity: row["carpool_departure_city"],
                    nbPlaces: row["nb_places"],
                    carpoolRemainingPlaces: row["carpool_remaining_places"],
                    eventId: row["event_id"],
                    conductorId: row["conductor_id"],
                    conductor: new models_1.UserModel({
                        mail: row["conductor_id"],
                        password: row["user_password"],
                        name: row["user_name"],
                        firstname: row["user_firstname"],
                        phoneNumber: row["user_phone_number"]
                    })
                });
            });
        }
        return [];
    }
    async getCarpoolMembersById(carpoolId) {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        user_type_id
                                                 FROM ${user_controller_1.UserController.userTable}
                                                          JOIN RESERVE_USER_CARPOOL RUC ON RUC.user_id = ${user_controller_1.UserController.userTable}.user_mail
                                                 WHERE carpool_id = ?`, [
            carpoolId
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
                    typeId: row["user_type_id"]
                });
            });
        }
        return [];
    }
    async getOldAdressesCarpoolByUser(userMail) {
        const res = await this.connection.query(`SELECT DISTINCT carpool_departure_street,
                                                                 carpool_departure_zipcode,
                                                                 carpool_departure_city
                                                 FROM CARPOOL
                                                 WHERE conductor_id = ?`, [
            userMail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return {
                    "street": row['carpool_departure_street'],
                    "zipcode": row['carpool_departure_zipcode'],
                    "city": row['carpool_departure_city'],
                };
            });
        }
        return [];
    }
}
exports.CarpoolController = CarpoolController;
//# sourceMappingURL=carpool-controller.js.map