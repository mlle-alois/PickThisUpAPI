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
     * @param mediaId
     */
    getMediaById(mediaId: number): Promise<MediaModel | LogError> {
        return this.mediaController.getMediaById(mediaId);
    }
}