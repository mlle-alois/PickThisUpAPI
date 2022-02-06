"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaServiceImpl = void 0;
const models_1 = require("../../models");
const controllers_1 = require("../../controllers");
class MediaServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.mediaController = new controllers_1.MediaController(this.connection);
    }
    createMedia(options) {
        return this.mediaController.createMedia(options);
    }
    getMediaById(mediaId) {
        return this.mediaController.getMediaById(mediaId);
    }
    async getMaxMediaId() {
        return this.mediaController.getMaxMediaId();
    }
    async deleteMedia(mediaId) {
        const media = await this.getMediaById(mediaId);
        if (media instanceof models_1.LogError)
            return false;
        return this.mediaController.deleteMedia(mediaId);
    }
}
exports.MediaServiceImpl = MediaServiceImpl;
//# sourceMappingURL=media-service-impl.js.map