import {LogError, MediaModel} from "../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";

export class MediaController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Récupération d'un media depuis son :
     * @param mediaId
     */
    async getMediaById(mediaId: number): Promise<MediaModel | LogError> {
        const res = await this.connection.query(`SELECT media_id, media_path
                                                 FROM MEDIA
                                                 where media_id = ?`, [
            mediaId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new MediaModel({
                    mediaId: row["media_id"],
                    mediaPath: row["media_path"]
                });
            }
        }
        return new LogError({numError: 404, text: "Media not found"});
    }

    async getMaxMediaId(): Promise<number> {
        const res = await this.connection.query('SELECT MAX(media_id) as maxId FROM MEDIA');
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

    async createMedia(options: MediaModel): Promise<MediaModel | LogError> {
        try {
            const res = await this.connection.execute(`INSERT INTO MEDIA (media_path)
                                           VALUES (?)`, [
                options.mediaPath
            ]);
            const headers = res[0] as ResultSetHeader;
            if(headers.affectedRows > 0) {
                return await this.getMediaById(headers.insertId);
            }
            return new LogError({numError: 500, text: "Error during media creation"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during media creation"});
        }
    }

    async deleteMedia(mediaId: number): Promise<boolean> {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM MEDIA
                                                     WHERE media_id = ?`, [
                mediaId
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}