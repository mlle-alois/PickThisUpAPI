export interface IZoneProps {
    zoneId: number;
    zoneStreet: string;
    zoneZipcode: number;
    zoneCity: string;
    zoneDescription: string;
    signalmanId: string;
    statusId: number;
}

export class ZoneModel implements IZoneProps {
    zoneId: number;
    zoneStreet: string;
    zoneZipcode: number;
    zoneCity: string;
    zoneDescription: string;
    signalmanId: string;
    statusId: number;

    constructor(properties: IZoneProps) {
        this.zoneId = properties.zoneId;
        this.zoneStreet = properties.zoneStreet;
        this.zoneZipcode = properties.zoneZipcode;
        this.zoneCity = properties.zoneCity;
        this.zoneDescription = properties.zoneDescription;
        this.signalmanId = properties.signalmanId;
        this.statusId = properties.statusId;
    }
}