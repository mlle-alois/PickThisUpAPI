import {PollutionLevelModel} from "./pollution-level-model";

export interface IZoneProps {
    zoneId: number;
    zoneStreet: string;
    zoneZipcode: string;
    zoneCity: string;
    zoneDescription: string;
    signalmanId: string;
    statusId: number;
    pollutionLevelId: number;
    pollutionLevel?: PollutionLevelModel;
}

export class ZoneModel implements IZoneProps {
    zoneId: number;
    zoneStreet: string;
    zoneZipcode: string;
    zoneCity: string;
    zoneDescription: string;
    signalmanId: string;
    statusId: number;
    pollutionLevelId: number;
    pollutionLevel?: PollutionLevelModel;

    constructor(properties: IZoneProps) {
        this.zoneId = properties.zoneId;
        this.zoneStreet = properties.zoneStreet;
        this.zoneZipcode = properties.zoneZipcode;
        this.zoneCity = properties.zoneCity;
        this.zoneDescription = properties.zoneDescription;
        this.signalmanId = properties.signalmanId;
        this.statusId = properties.statusId;
        this.pollutionLevelId = properties.pollutionLevelId;
        this.pollutionLevel = properties.pollutionLevel;
    }
}
