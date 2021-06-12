import {UserModel} from "./user-model";

export interface ICarpoolProps {
    carpoolId: number;
    carpoolDepartureStreet: string;
    carpoolDepartureZipcode: string;
    carpoolDepartureCity: string;
    nbPlaces: number;
    carpoolRemainingPlaces?: number;
    eventId: number;
    conductorId: string;
    conductor?: UserModel;
}

export class CarpoolModel implements ICarpoolProps {
    carpoolId: number;
    carpoolDepartureStreet: string;
    carpoolDepartureZipcode: string;
    carpoolDepartureCity: string;
    nbPlaces: number;
    carpoolRemainingPlaces?: number;
    eventId: number;
    conductorId: string;
    conductor?: UserModel;

    constructor(properties: ICarpoolProps) {
        this.carpoolId = properties.carpoolId;
        this.carpoolDepartureStreet = properties.carpoolDepartureStreet;
        this.carpoolDepartureZipcode = properties.carpoolDepartureZipcode;
        this.carpoolDepartureCity = properties.carpoolDepartureCity;
        this.nbPlaces = properties.nbPlaces;
        this.carpoolRemainingPlaces = properties.carpoolRemainingPlaces;
        this.eventId = properties.eventId;
        this.conductorId = properties.conductorId;
        this.conductor = properties.conductor;
    }
}
