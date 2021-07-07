import {LogError, ZoneModel, UserModel, MediaModel, EventModel} from "../models";
import {ZoneGetAllOptions, ZoneUpdateOptions} from "../controllers";

export interface ZoneService {

    createZone(options: ZoneModel): Promise<ZoneModel | LogError>;

    getMaxZoneId(): Promise<number>;

    getZoneById(zoneId: number): Promise<ZoneModel | LogError>;

    updateZone(options: ZoneUpdateOptions): Promise<ZoneModel | LogError>;

    deleteZoneById(zoneId: number): Promise<boolean>;

    getAllAvailableZones(userMail: string, options?: ZoneGetAllOptions): Promise<ZoneModel[] | LogError>;

    acceptZone(zoneId: number): Promise<ZoneModel | LogError>;

    refuseZone(zoneId: number): Promise<ZoneModel | LogError>;

    getZonesByUser(userMail: string): Promise<ZoneModel[] | LogError>;

    getValidatedZones(): Promise<ZoneModel[]>;

    getWaitingZones(): Promise<ZoneModel[]>;

    getRefusedZones(): Promise<ZoneModel[]>;

    getZonesByUserAndStatus(userMail: string, statusId: number): Promise<ZoneModel[] | LogError>;

    addMediaToZone(options: MediaModel, zoneId: number): Promise<MediaModel | LogError>;

    removeMediaToZone(mediaId: number, zoneId: number): Promise<boolean>;

    getMediaZonesById(zoneId: number): Promise<MediaModel[] | LogError>;
}