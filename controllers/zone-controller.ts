import {ZoneModel, LogError, UserModel} from "../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {DateUtils} from "../Utils";

export interface ZoneGetAllOptions {
    limit?: number;
    offset?: number;
}

export interface ZoneUpdateOptions {
    zoneId: number;
    zoneStreet: string;
    zoneZipcode: number;
    zoneCity: string;
    zoneDescription: string;
}

export class ZoneController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getAllAvailableZones(userMail: string, options?: ZoneGetAllOptions): Promise<ZoneModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const res = await this.connection.query(`SELECT zone_id,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        zone_description,
                                                        signalman_id,
                                                        status_id
                                                 FROM ZONE
                                                 WHERE status_id = 4
                                                 OR (status_id = 5 AND signalman_id = ?)
                                                 LIMIT ?, ?`, [
            userMail, offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new ZoneModel({
                    zoneId: row["zone_id"],
                    zoneStreet: row["zone_street"],
                    zoneZipcode: row["zone_zipcode"],
                    zoneCity: row["zone_city"],
                    zoneDescription: row["zone_description"],
                    signalmanId: row["signalman_id"],
                    statusId: row["status_id"]
                });
            });
        }
        return [];
    }

    async getZoneById(zoneId: number): Promise<ZoneModel | LogError> {
        const res = await this.connection.query(`SELECT zone_id,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        zone_description,
                                                        signalman_id,
                                                        status_id
                                                 FROM ZONE
                                                 where zone_id = ?`, [
            zoneId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new ZoneModel({
                    zoneId: row["zone_id"],
                    zoneStreet: row["zone_street"],
                    zoneZipcode: row["zone_zipcode"],
                    zoneCity: row["zone_city"],
                    zoneDescription: row["zone_description"],
                    signalmanId: row["signalman_id"],
                    statusId: row["status_id"]
                });
            }
        }
        return new LogError({numError: 404, text: "Zone not found"});
    }

    async getMaxZoneId(): Promise<number> {
        const res = await this.connection.query('SELECT MAX(zone_id) as maxId FROM ZONE');
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

    async createZone(options: ZoneModel): Promise<ZoneModel | LogError> {
        try {
            await this.connection.execute(`INSERT INTO ZONE (zone_id,
                                                             zone_street,
                                                             zone_zipcode,
                                                             zone_city,
                                                             zone_description,
                                                             signalman_id,
                                                             status_id)
                                           VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                options.zoneId,
                options.zoneStreet,
                options.zoneZipcode,
                options.zoneCity,
                options.zoneDescription,
                options.signalmanId,
                options.statusId
            ]);

            return await this.getZoneById(options.zoneId);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during zone creation"});
        }
    }

    async deleteZonesById(zoneId: number): Promise<boolean> {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM ZONE
                                                     WHERE zone_id = ?`, [
                zoneId
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async updateZone(options: ZoneUpdateOptions): Promise<ZoneModel | LogError> {
        const setClause: string[] = [];
        const params = [];

        if (options.zoneStreet !== undefined) {
            setClause.push("zone_street = ?");
            params.push(options.zoneStreet);
        }
        if (options.zoneZipcode !== undefined) {
            setClause.push("zone_zipcode = ?");
            params.push(options.zoneZipcode);
        }
        if (options.zoneCity !== undefined) {
            setClause.push("zone_city = ?");
            params.push(options.zoneCity);
        }
        if (options.zoneDescription !== undefined) {
            setClause.push("zone_description = ?");
            params.push(options.zoneDescription);
        }
        params.push(options.zoneId);
        try {
            const res = await this.connection.execute(`UPDATE ZONE SET ${setClause.join(", ")} WHERE zone_id = ?`, params);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getZoneById(options.zoneId);
            }
            return new LogError({numError: 400, text: "The zone update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The zone update failed"});
        }
    }

    async getZonesByUser(userMail: string): Promise<ZoneModel[]> {
        const res = await this.connection.query(`SELECT zone_id,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        zone_description,
                                                        signalman_id,
                                                        status_id
                                                 FROM ZONE
                                                 WHERE signalman_id = ?`, [
            userMail
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new ZoneModel({
                    zoneId: row["zone_id"],
                    zoneStreet: row["zone_street"],
                    zoneZipcode: row["zone_zipcode"],
                    zoneCity: row["zone_city"],
                    zoneDescription: row["zone_description"],
                    signalmanId: row["signalman_id"],
                    statusId: row["status_id"]
                });
            });
        }
        return [];
    }

    async getZonesByUserAndStatus(userMail: string, statusId: number): Promise<ZoneModel[]> {
        const res = await this.connection.query(`SELECT zone_id,
                                                        zone_street,
                                                        zone_zipcode,
                                                        zone_city,
                                                        zone_description,
                                                        signalman_id,
                                                        status_id
                                                 FROM ZONE
                                                 WHERE signalman_id = ?
                                                 AND status_id = ?`, [
            userMail, statusId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new ZoneModel({
                    zoneId: row["zone_id"],
                    zoneStreet: row["zone_street"],
                    zoneZipcode: row["zone_zipcode"],
                    zoneCity: row["zone_city"],
                    zoneDescription: row["zone_description"],
                    signalmanId: row["signalman_id"],
                    statusId: row["status_id"]
                });
            });
        }
        return [];
    }

    async acceptZone(zoneId: number): Promise<ZoneModel | LogError> {
        try {
            const res = await this.connection.execute(`UPDATE ZONE
                                                       SET status_id = 4
                                                       WHERE zone_id = ?`, [
                zoneId
            ]);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getZoneById(zoneId);
            }
            return new LogError({numError: 400, text: "The zone validation failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The zone validation failed"});
        }
    }

    async refuseZone(zoneId: number): Promise<ZoneModel | LogError> {
        try {
            const res = await this.connection.execute(`UPDATE ZONE
                                                       SET status_id = 6
                                                       WHERE zone_id = ?`, [
                zoneId
            ]);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getZoneById(zoneId);
            }
            return new LogError({numError: 400, text: "The zone refusal failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The zone refusal failed"});
        }
    }
}