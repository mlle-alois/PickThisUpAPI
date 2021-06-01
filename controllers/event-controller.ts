import {EventModel, LogError, MediaModel, UserModel, ZoneModel} from "../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {UserGetAllOptions} from "./user-controller";
import {DateUtils} from "../Utils";

export interface EventGetAllOptions {
    limit?: number;
    offset?: number;
}

export interface EventUpdateOptions {
    eventId: number;
    eventTitle: string;
    eventDescription: string;
    dateHourStart: Date;
    dateHourEnd: Date;
    eventMaxNbPlaces: number;
    eventPitureId: number;
}

export class EventController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getAllValidatedEvents(options?: EventGetAllOptions): Promise<EventModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

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
                                                        signalman_id
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
            return (data as RowDataPacket[]).map(function (row: any) {
                return new EventModel({
                    eventId: row["event_id"],
                    eventTitle: row["event_title"],
                    eventDescription: row["event_description"],
                    dateHourStart: row["date_hour_start"],
                    dateHourEnd: row["date_hour_end"],
                    dateHourCreation: row["date_hour_creation"],
                    eventMaxNbPlaces: row["event_max_nb_places"],
                    eventRemainingPlaces: row["event_remaining_places"],
                    eventPitureId: row["event_picture_id"],
                    picture: new MediaModel({
                        mediaId: row["event_picture_id"],
                        mediaPath: row["media_path"]
                    }),
                    statusId: row["event_status_id"],
                    creatorId: row["creator_id"],
                    zoneId: row["zone_id"],
                    zone: new ZoneModel({
                        zoneId: row["zone_id"],
                        zoneDescription: row["zone_description"],
                        zoneStreet: row["zone_street"],
                        zoneZipcode: row["zone_zipcode"],
                        zoneCity: row["zone_city"],
                        statusId: row["zone_status_id"],
                        signalmanId: row["signalman_id"]
                    })
                });
            });
        }
        return [];
    }

    async getEventById(eventId: number): Promise<EventModel | LogError> {
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
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new EventModel({
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
        return new LogError({numError: 404, text: "Event not found"});
    }

    async getMaxEventId(): Promise<number> {
        const res = await this.connection.query('SELECT MAX(event_id) as maxId FROM EVENT');
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                if (row["maxId"] === null) {
                    return 0;
                } else {
                    return row["maxId"];
                }
            }
        }
        return 0;
    }

    async createEvent(options: EventModel): Promise<EventModel | LogError> {
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
                DateUtils.addXHoursToDate(new Date(options.dateHourStart), 2),
                DateUtils.addXHoursToDate(new Date(options.dateHourEnd), 2),
                options.dateHourCreation,
                options.eventMaxNbPlaces,
                options.eventPitureId,
                options.statusId,
                options.creatorId,
                options.zoneId
            ]);

            return await this.getEventById(options.eventId);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during event creation"});
        }
    }

    async deleteEventsById(eventId: number): Promise<boolean> {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM EVENT
                                                     WHERE event_id = ?`, [
                eventId
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async updateEvent(options: EventUpdateOptions): Promise<EventModel | LogError> {
        const setClause: string[] = [];
        const params = [];
        //création des contenus de la requête dynamiquement
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
            params.push(DateUtils.addXHoursToDate(new Date(options.dateHourStart), 2));
        }
        if (options.dateHourEnd !== undefined) {
            setClause.push("date_hour_end = ?");
            params.push(DateUtils.addXHoursToDate(new Date(options.dateHourEnd), 2));
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
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getEventById(options.eventId);
            }
            return new LogError({numError: 400, text: "The event update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The event update failed"});
        }
    }

    async registerEvent(eventId: number, userMail: string): Promise<UserModel[] | LogError> {
        try {
            await this.connection.execute(`INSERT INTO PARTICIPATE_USER_EVENT (user_id, event_id)
                                           VALUES (?, ?)`, [
                userMail, eventId
            ]);

            return await this.getParticipantsEvent(eventId);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during registration"});
        }
    }

    async unregisterEvent(eventId: number, userMail: string): Promise<UserModel[] | LogError> {
        try {
            await this.connection.execute(`DELETE
                                           FROM PARTICIPATE_USER_EVENT
                                           WHERE user_id = ?
                                             AND event_id = ?`, [
                userMail, eventId
            ]);

            return await this.getParticipantsEvent(eventId);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during unregistration"});
        }
    }

    async getPastEventsByUser(userMail: string): Promise<EventModel[]> {
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
                                                 WHERE creator_id = ?
                                                   AND date_hour_end < NOW()
                                                 ORDER BY status_id ASC, date_hour_start DESC`, [
            userMail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new EventModel({
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
            });
        }
        return [];
    }

    async getFutureEventsByUser(userMail: string): Promise<EventModel[]> {
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
                                                 WHERE creator_id = ?
                                                   AND date_hour_start > NOW()
                                                 ORDER BY status_id ASC, date_hour_start DESC`, [
            userMail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new EventModel({
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
            });
        }
        return [];
    }

    async getActualEventsByUser(userMail: string): Promise<EventModel[]> {
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
                                                 WHERE creator_id = ?
                                                   AND date_hour_start < NOW()
                                                   AND date_hour_end > NOW()
                                                 ORDER BY status_id ASC, date_hour_start DESC`, [
            userMail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new EventModel({
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
            });
        }
        return [];
    }

    async acceptEvent(eventId: number): Promise<EventModel | LogError> {
        try {
            const res = await this.connection.execute(`UPDATE EVENT
                                                       SET status_id = 4
                                                       WHERE event_id = ?`, [
                eventId
            ]);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getEventById(eventId);
            }
            return new LogError({numError: 400, text: "The event validation failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The event validation failed"});
        }
    }

    async refuseEvent(eventId: number): Promise<EventModel | LogError> {
        try {
            const res = await this.connection.execute(`UPDATE EVENT
                                                       SET status_id = 6
                                                       WHERE event_id = ?`, [
                eventId
            ]);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getEventById(eventId);
            }
            return new LogError({numError: 400, text: "The event refusal failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The event refusal failed"});
        }
    }

    async getParticipantsEvent(eventId: number): Promise<UserModel[]> {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        user_type_id
                                                 FROM USER
                                                          JOIN PARTICIPATE_USER_EVENT ON user_mail = user_id
                                                 WHERE event_id = ?`, [
            eventId
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
                    typeId: row["user_type_id"]
                });
            });
        }
        return [];
    }
}