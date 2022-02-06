"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const models_1 = require("../models");
class MediaController {
    constructor(connection) {
        this.connection = connection;
    }
    async getMediaById(mediaId) {
        const res = await this.connection.query(`SELECT media_id, media_path
                                                 FROM MEDIA
                                                 where media_id = ?`, [
            mediaId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.MediaModel({
                    mediaId: row["media_id"],
                    mediaPath: row["media_path"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "Media not found" });
    }
    async getMaxMediaId() {
        const res = await this.connection.query('SELECT MAX(media_id) as maxId FROM MEDIA');
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
    async createMedia(options) {
        try {
            const res = await this.connection.execute(`INSERT INTO MEDIA (media_path)
                                           VALUES (?)`, [
                options.mediaPath
            ]);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return await this.getMediaById(headers.insertId);
            }
            return new models_1.LogError({ numError: 500, text: "Error during media creation" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during media creation" });
        }
    }
    async deleteMedia(mediaId) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM MEDIA
                                                     WHERE media_id = ?`, [
                mediaId
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}
exports.MediaController = MediaController;
//# sourceMappingURL=media-controller.js.map