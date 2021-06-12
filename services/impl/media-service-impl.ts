import {LogError, MediaModel} from "../../models";
import {Connection} from "mysql2/promise";
import {MediaService} from "../media-service";
import {MediaController} from "../../controllers";

export class MediaServiceImpl implements MediaService {

    private connection: Connection;
    private mediaController: MediaController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.mediaController = new MediaController(this.connection);
    }

    /**
     * Récupération d'un media depuis son :
     * @param options
     */
    createMedia(options: MediaModel): Promise<MediaModel | LogError> {
        return this.mediaController.createMedia(options);
    }

    /**
     * Récupération d'un media depuis son :
     * @param mediaId
     */
    getMediaById(mediaId: number): Promise<MediaModel | LogError> {
        return this.mediaController.getMediaById(mediaId);
    }

    /**
     * Récupération de l'id de media maximum existant
     */
    async getMaxMediaId(): Promise<number> {
        return this.mediaController.getMaxMediaId();
    }

    /**
     * suppression d'un media selon son id
     * @param mediaId
     */
    async deleteMedia(mediaId: number): Promise<boolean> {
        const media = await this.getMediaById(mediaId);
        if (media instanceof LogError)
            return false;

        return this.mediaController.deleteMedia(mediaId);
    }

}