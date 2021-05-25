import {LogError, ZoneModel, UserModel} from "../models";
import {ZoneGetAllOptions, ZoneUpdateOptions} from "../controllers";

export interface ZoneService {

    createZone(options: ZoneModel): Promise<ZoneModel | LogError>;

    getMaxZoneId(): Promise<number>;

    getZoneById(zoneId: number): Promise<ZoneModel | LogError>;

    updateZone(options: ZoneUpdateOptions): Promise<ZoneModel | LogError>;

    deleteZonesById(zoneId: number): Promise<boolean>;

    getAllAvailableZones(userMail: string, options?: ZoneGetAllOptions): Promise<ZoneModel[] | LogError>;

    acceptZone(zoneId: number): Promise<ZoneModel | LogError>;

    refuseZone(zoneId: number): Promise<ZoneModel | LogError>;

    getZonesByUser(userMail: string): Promise<ZoneModel[] | LogError>;

    getZonesByUserAndStatus(userMail: string, statusId: number): Promise<ZoneModel[] | LogError>;
}