import {LogError, MediaModel} from "../models";

export interface MediaService {

    getMediaById(mediaId: number): Promise<MediaModel | LogError>;

}