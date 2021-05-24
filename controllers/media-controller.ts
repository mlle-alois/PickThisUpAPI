import {LogError, MediaModel} from "../models";
import {Connection, RowDataPacket} from "mysql2/promise";

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
}