import {LogError, MediaModel} from "../models";

export interface MediaService {

    createMedia(options: MediaModel): Promise<MediaModel | LogError>;

    getMediaById(mediaId: number): Promise<MediaModel | LogError>;

    getMaxMediaId(): Promise<number>;

    deleteMedia(mediaId: number): Promise<boolean>;

}