export interface MediaModelProps {
    mediaId: number;
    mediaPath: string;
}

export class MediaModel implements MediaModelProps {
    mediaId: number;
    mediaPath: string;

    constructor(properties: MediaModelProps) {
        this.mediaId = properties.mediaId;
        this.mediaPath = properties.mediaPath;
    }
}