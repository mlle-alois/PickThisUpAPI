"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const models_1 = require("../models");
const user_controller_1 = require("./user-controller");
class EventController {
    constructor(connection) {
        this.connection = connection;
    }
    async getAllValidatedEvents(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT EVENT.event_id,
                                                        event_title,
                                                        event_description,
                                                        date_hour_start,
                                                        date_hour_start > NOW()                                as isFuture,
                                                        date_hour_end,
                                                        date_hour_creation,
                                                        event_max_nb_places,
                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,
                                                        event_picture_id,
                                                        coalesce(media_path, "pickThisUpLogo.PNG")             as media_path,
                                                        EVENT.status_id                                        as event_status_id,
                                                        creator_id,
                                                        EVENT.zone_id                                          as zone_id,
                                                        zone_description,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        ZONE.status_id                                         as zone_status_id,
                                                        signalman_id,
                                                        pollution_level_id
                                                 FROM EVENT
                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id
                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id
                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id
                                                 WHERE EVENT.status_id = 4
                                                 GROUP BY EVENT.event_id, event_title
                                                 ORDER BY isFuture DESC, date_hour_start ASC LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventRemainingPlaces: row["event_remaining_places"],
                    eventPitureId: row["event_picture_id"],
                    picture: new models_1.MediaModel({
                        mediaId: row["event_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    statusId: row["event_status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"],
                    zone: new models_1.ZoneModel({
                        zoneId: row["zone_id"],
                        zoneDescription: row["zone_description"],
                        zoneStreet: row["zone_street"],
                        zoneZipcode: row["zone_zipcode"],
                        zoneCity: row["zone_city"],
                        statusId: row["zone_status_id"],
                        signalmanId: row["signalman_id"],
                        pollutionLevelId: row["pollution_level_id"]
                    })
                });
            });
        }
        return [];
    }
    async getEventById(eventId) {
        const res = await this.connection.query(`SELECT event_id,
                                                        event_title,
                                                        event_description,
                                                        date_hour_start,
                                                        date_hour_end,
                                                        date_hour_creation,
                                                        event_max_nb_places,
                                                        event_picture_id,
                                                        status_id,
                                                        creator_id,
                                                        zone_id
                                                 FROM EVENT
                                                 where event_id = ?`, [
            eventId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventPitureId: row["event_picture_id"],
                    statusId: row["status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "Event not found" });
    }
    async getMaxEventId() {
        const res = await this.connection.query('SELECT MAX(event_id) as maxId FROM EVENT');
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
    async createEvent(options) {
        try {
            await this.connection.execute(`INSERT INTO EVENT (event_id,
                                                              event_title,
                                                              event_description,
                                                              date_hour_start,
                                                              date_hour_end,
                                                              date_hour_creation,
                                                              event_max_nb_places,
                                                              event_picture_id,
                                                              status_id,
                                                              creator_id,
                                                              zone_id)
                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                options.eventId,
                options.eventTitle,
                options.eventDescription,
                new Date(options.dateHourStart),
                new Date(options.dateHourEnd),
                options.dateHourCreation,
                options.eventMaxNbPlaces,
                options.eventPitureId,
                options.statusId,
                options.creatorId,
                options.zoneId
            ]);
            return await this.getEventById(options.eventId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during event creation" });
        }
    }
    async deleteEventsById(eventId) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM EVENT
                                                     WHERE event_id = ?`, [
                eventId
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async updateEvent(options) {
        const setClause = [];
        const params = [];
        if (options.eventTitle !== undefined) {
            setClause.push("event_title = ?");
            params.push(options.eventTitle);
        }
        if (options.eventDescription !== undefined) {
            setClause.push("event_description = ?");
            params.push(options.eventDescription);
        }
        if (options.dateHourStart !== undefined) {
            setClause.push("date_hour_start = ?");
            params.push(new Date(options.dateHourStart));
        }
        if (options.dateHourEnd !== undefined) {
            setClause.push("date_hour_end = ?");
            params.push(new Date(options.dateHourEnd));
        }
        if (options.eventMaxNbPlaces !== undefined) {
            setClause.push("event_max_nb_places = ?");
            params.push(options.eventMaxNbPlaces);
        }
        if (options.eventPitureId !== undefined) {
            setClause.push("event_picture_id = ?");
            params.push(options.eventPitureId);
        }
        params.push(options.eventId);
        try {
            const res = await this.connection.execute(`UPDATE EVENT SET ${setClause.join(", ")} WHERE event_id = ?`, params);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getEventById(options.eventId);
            }
            return new models_1.LogError({ numError: 400, text: "The event update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The event update failed" });
        }
    }
    async registerEvent(eventId, userMail) {
        try {
            await this.connection.execute(`INSERT INTO PARTICIPATE_USER_EVENT (user_id, event_id)
                                           VALUES (?, ?)`, [
                userMail, eventId
            ]);
            return await this.getParticipantsEvent(eventId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during registration" });
        }
    }
    async unregisterEvent(eventId, userMail) {
        try {
            await this.connection.execute(`DELETE
                                           FROM PARTICIPATE_USER_EVENT
                                           WHERE user_id = ?
                                             AND event_id = ?`, [
                userMail, eventId
            ]);
            return await this.getParticipantsEvent(eventId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during unregistration" });
        }
    }
    async getPastEventsByUser(userMail) {
        const res = await this.connection.query(`SELECT EVENT.event_id,
                                                        event_title,
                                                        event_description,
                                                        date_hour_start,
                                                        date_hour_start > NOW()                                as isFuture,
                                                        date_hour_end,
                                                        date_hour_creation,
                                                        event_max_nb_places,
                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,
                                                        event_picture_id,
                                                        coalesce(media_path, "pickThisUpLogo.PNG")             as media_path,
                                                        EVENT.status_id                                        as event_status_id,
                                                        creator_id,
                                                        EVENT.zone_id                                          as zone_id,
                                                        zone_description,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        ZONE.status_id                                         as zone_status_id,
                                                        signalman_id,
                                                        pollution_level_id
                                                 FROM EVENT
                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id
                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id
                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id
                                                    WHERE ( creator_id = ? OR user_id = ? )
                                                AND date_hour_end < NOW()
                                                GROUP BY EVENT.event_id, event_title
                                                 ORDER BY EVENT.status_id ASC, date_hour_start DESC`, [
            userMail, userMail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventRemainingPlaces: row["event_remaining_places"],
                    eventPitureId: row["event_picture_id"],
                    picture: new models_1.MediaModel({
                        mediaId: row["event_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    statusId: row["event_status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"],
                    zone: new models_1.ZoneModel({
                        zoneId: row["zone_id"],
                        zoneDescription: row["zone_description"],
                        zoneStreet: row["zone_street"],
                        zoneZipcode: row["zone_zipcode"],
                        zoneCity: row["zone_city"],
                        statusId: row["zone_status_id"],
                        signalmanId: row["signalman_id"],
                        pollutionLevelId: row["pollution_level_id"]
                    })
                });
            });
        }
        return [];
    }
    async getFutureEventsByUser(userMail) {
        const res = await this.connection.query(`SELECT EVENT.event_id,
                                                        event_title,
                                                        event_description,
                                                        date_hour_start,
                                                        date_hour_end,
                                                        date_hour_creation,
                                                        event_max_nb_places,
                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,
                                                        event_picture_id,
                                                        coalesce(media_path, "pickThisUpLogo.PNG")             as media_path,
                                                        EVENT.status_id                                        as event_status_id,
                                                        creator_id,
                                                        EVENT.zone_id                                          as zone_id,
                                                        zone_description,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        ZONE.status_id                                         as zone_status_id,
                                                        signalman_id,
                                                        pollution_level_id
                                                 FROM EVENT
                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id
                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id
                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id
                                               WHERE ( creator_id = ? OR user_id = ? )
                                                AND date_hour_start > NOW()
                                                GROUP BY EVENT.event_id, event_title
                                                 ORDER BY EVENT.status_id ASC, date_hour_start DESC`, [
            userMail, userMail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventRemainingPlaces: row["event_remaining_places"],
                    eventPitureId: row["event_picture_id"],
                    picture: new models_1.MediaModel({
                        mediaId: row["event_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    statusId: row["event_status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"],
                    zone: new models_1.ZoneModel({
                        zoneId: row["zone_id"],
                        zoneDescription: row["zone_description"],
                        zoneStreet: row["zone_street"],
                        zoneZipcode: row["zone_zipcode"],
                        zoneCity: row["zone_city"],
                        statusId: row["zone_status_id"],
                        signalmanId: row["signalman_id"],
                        pollutionLevelId: row["pollution_level_id"]
                    })
                });
            });
        }
        return [];
    }
    async getActualEventsByUser(userMail) {
        const res = await this.connection.query(`SELECT EVENT.event_id,
                                                        event_title,
                                                        event_description,
                                                        date_hour_start,
                                                        date_hour_start > NOW()                                as isFuture,
                                                        date_hour_end,
                                                        date_hour_creation,
                                                        event_max_nb_places,
                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,
                                                        event_picture_id,
                                                        coalesce(media_path, "pickThisUpLogo.PNG")             as media_path,
                                                        EVENT.status_id                                        as event_status_id,
                                                        creator_id,
                                                        EVENT.zone_id                                          as zone_id,
                                                        zone_description,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        ZONE.status_id                                         as zone_status_id,
                                                        signalman_id,
                                                        pollution_level_id
                                                 FROM EVENT
                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id
                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id
                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id
                                                    WHERE ( creator_id = ? OR user_id = ? )
                                                      AND date_hour_start < NOW()
                                                      AND date_hour_end > NOW()
                                                      GROUP BY EVENT.event_id, event_title
                                                    ORDER BY EVENT.status_id ASC, date_hour_start DESC`, [
            userMail, userMail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventRemainingPlaces: row["event_remaining_places"],
                    eventPitureId: row["event_picture_id"],
                    picture: new models_1.MediaModel({
                        mediaId: row["event_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    statusId: row["event_status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"],
                    zone: new models_1.ZoneModel({
                        zoneId: row["zone_id"],
                        zoneDescription: row["zone_description"],
                        zoneStreet: row["zone_street"],
                        zoneZipcode: row["zone_zipcode"],
                        zoneCity: row["zone_city"],
                        statusId: row["zone_status_id"],
                        signalmanId: row["signalman_id"],
                        pollutionLevelId: row["pollution_level_id"]
                    })
                });
            });
        }
        return [];
    }
    async getValidatedEvents() {
        const res = await this.connection.query(`SELECT EVENT.event_id,
                                                        event_title,
                                                        event_description,
                                                        date_hour_start,
                                                        date_hour_start > NOW()                                as isFuture,
                                                        date_hour_end,
                                                        date_hour_creation,
                                                        event_max_nb_places,
                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,
                                                        event_picture_id,
                                                        coalesce(media_path, "pickThisUpLogo.PNG")             as media_path,
                                                        EVENT.status_id                                        as event_status_id,
                                                        creator_id,
                                                        EVENT.zone_id                                          as zone_id,
                                                        zone_description,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        ZONE.status_id                                         as zone_status_id,
                                                        signalman_id,
                                                        pollution_level_id
                                                 FROM EVENT
                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id
                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id
                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id
                                                 WHERE EVENT.status_id = 4
                                                 GROUP BY EVENT.event_id, event_title
                                                 ORDER BY date_hour_start DESC`);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventRemainingPlaces: row["event_remaining_places"],
                    eventPitureId: row["event_picture_id"],
                    picture: new models_1.MediaModel({
                        mediaId: row["event_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    statusId: row["event_status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"],
                    zone: new models_1.ZoneModel({
                        zoneId: row["zone_id"],
                        zoneDescription: row["zone_description"],
                        zoneStreet: row["zone_street"],
                        zoneZipcode: row["zone_zipcode"],
                        zoneCity: row["zone_city"],
                        statusId: row["zone_status_id"],
                        signalmanId: row["signalman_id"],
                        pollutionLevelId: row["pollution_level_id"]
                    })
                });
            });
        }
        return [];
    }
    async getWaitingEvents() {
        const res = await this.connection.query(`SELECT EVENT.event_id,
                                                        event_title,
                                                        event_description,
                                                        date_hour_start,
                                                        date_hour_start > NOW()                                as isFuture,
                                                        date_hour_end,
                                                        date_hour_creation,
                                                        event_max_nb_places,
                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,
                                                        event_picture_id,
                                                        coalesce(media_path, "pickThisUpLogo.PNG")             as media_path,
                                                        EVENT.status_id                                        as event_status_id,
                                                        creator_id,
                                                        EVENT.zone_id                                          as zone_id,
                                                        zone_description,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        ZONE.status_id                                         as zone_status_id,
                                                        signalman_id,
                                                        pollution_level_id
                                                 FROM EVENT
                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id
                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id
                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id
                                                 WHERE EVENT.status_id = 5
                                                 GROUP BY EVENT.event_id, event_title
                                                 ORDER BY date_hour_start`);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventRemainingPlaces: row["event_remaining_places"],
                    eventPitureId: row["event_picture_id"],
                    picture: new models_1.MediaModel({
                        mediaId: row["event_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    statusId: row["event_status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"],
                    zone: new models_1.ZoneModel({
                        zoneId: row["zone_id"],
                        zoneDescription: row["zone_description"],
                        zoneStreet: row["zone_street"],
                        zoneZipcode: row["zone_zipcode"],
                        zoneCity: row["zone_city"],
                        statusId: row["zone_status_id"],
                        signalmanId: row["signalman_id"],
                        pollutionLevelId: row["pollution_level_id"]
                    })
                });
            });
        }
        return [];
    }
    async getRefusedEvents() {
        const res = await this.connection.query(`SELECT EVENT.event_id,
                                                        event_title,
                                                        event_description,
                                                        date_hour_start,
                                                        date_hour_start > NOW()                                as isFuture,
                                                        date_hour_end,
                                                        date_hour_creation,
                                                        event_max_nb_places,
                                                        COALESCE(event_max_nb_places - COUNT(PUE.event_id), 0) as event_remaining_places,
                                                        event_picture_id,
                                                        coalesce(media_path, "pickThisUpLogo.PNG")             as media_path,
                                                        EVENT.status_id                                        as event_status_id,
                                                        creator_id,
                                                        EVENT.zone_id                                          as zone_id,
                                                        zone_description,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        ZONE.status_id                                         as zone_status_id,
                                                        signalman_id,
                                                        pollution_level_id
                                                 FROM EVENT
                                                          JOIN ZONE ON ZONE.zone_id = EVENT.zone_id
                                                          LEFT JOIN MEDIA ON EVENT.event_picture_id = MEDIA.media_id
                                                          LEFT JOIN PARTICIPATE_USER_EVENT PUE ON EVENT.event_id = PUE.event_id
                                                 WHERE EVENT.status_id = 6
                                                 GROUP BY EVENT.event_id, event_title
                                                 ORDER BY date_hour_start DESC`);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventRemainingPlaces: row["event_remaining_places"],
                    eventPitureId: row["event_picture_id"],
                    picture: new models_1.MediaModel({
                        mediaId: row["event_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    statusId: row["event_status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"],
                    zone: new models_1.ZoneModel({
                        zoneId: row["zone_id"],
                        zoneDescription: row["zone_description"],
                        zoneStreet: row["zone_street"],
                        zoneZipcode: row["zone_zipcode"],
                        zoneCity: row["zone_city"],
                        statusId: row["zone_status_id"],
                        signalmanId: row["signalman_id"],
                        pollutionLevelId: row["pollution_level_id"]
                    })
                });
            });
        }
        return [];
    }
    async acceptEvent(eventId) {
        try {
            const res = await this.connection.execute(`UPDATE EVENT
                                                       SET status_id = 4
                                                       WHERE event_id = ?`, [
                eventId
            ]);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getEventById(eventId);
            }
            return new models_1.LogError({ numError: 400, text: "The event validation failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The event validation failed" });
        }
    }
    async refuseEvent(eventId) {
        try {
            const res = await this.connection.execute(`UPDATE EVENT
                                                       SET status_id = 6
                                                       WHERE event_id = ?`, [
                eventId
            ]);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getEventById(eventId);
            }
            return new models_1.LogError({ numError: 400, text: "The event refusal failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The event refusal failed" });
        }
    }
    async getParticipantsEvent(eventId) {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        user_type_id
                                                 FROM ${user_controller_1.UserController.userTable}
                                                          JOIN PARTICIPATE_USER_EVENT ON user_mail = user_id
                                                 WHERE event_id = ?`, [
            eventId
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
    async deleteEventCarpoolsOfUser(eventId, userMail) {
        try {
            await this.connection.execute(`DELETE
                                           FROM CARPOOL
                                           WHERE conductor_id = ?
                                             AND event_id = ?`, [
                userMail, eventId
            ]);
            return true;
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during deletion of user's carpools" });
        }
    }
}
exports.EventController = EventController;
//# sourceMappingURL=event-controller.js.map