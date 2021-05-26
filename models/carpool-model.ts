export interface ICarpoolProps {
    carpoolId: number;
    carpoolDepartureStreet: string;
    carpoolDepartureZipcode: string;
    carpoolDepartureCity: string;
    nbPlaces: number;
    eventId: number;
    conductorId: string;
}

export class CarpoolModel implements ICarpoolProps {
    carpoolId: number;
    carpoolDepartureStreet: string;
    carpoolDepartureZipcode: string;
    carpoolDepartureCity: string;
    nbPlaces: number;
    eventId: number;
    conductorId: string;

    constructor(properties: ICarpoolProps) {
        this.carpoolId = properties.carpoolId;
        this.carpoolDepartureStreet = properties.carpoolDepartureStreet;
        this.carpoolDepartureZipcode = properties.carpoolDepartureZipcode;
        this.carpoolDepartureCity = properties.carpoolDepartureCity;
        this.nbPlaces = properties.nbPlaces;
        this.eventId = properties.eventId;
        this.conductorId = properties.conductorId;
    }
}