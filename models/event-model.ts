import {ZoneModel} from "./zone-model";
import {MediaModel} from "./media-model";

export interface IEventProps {
    eventId: number;
    eventTitle: string;
    eventDescription: string;
    dateHourStart: Date;
    dateHourEnd: Date;
    dateHourCreation: Date;
    eventMaxNbPlaces: number;
    eventPitureId: number;
    picture?: MediaModel;
    statusId: number;
    creatorId: string;
    zoneId: number;
    zone?: ZoneModel;
}

export class EventModel implements IEventProps {
    eventId: number;
    eventTitle: string;
    eventDescription: string;
    dateHourStart: Date;
    dateHourEnd: Date;
    dateHourCreation: Date;
    eventMaxNbPlaces: number;
    eventPitureId: number;
    picture?: MediaModel;
    statusId: number;
    creatorId: string;
    zoneId: number;
    zone?: ZoneModel;

    constructor(properties: IEventProps) {
        this.eventId = properties.eventId;
        this.eventTitle = properties.eventTitle;
        this.eventDescription = properties.eventDescription;
        this.dateHourStart = properties.dateHourStart;
        this.dateHourEnd = properties.dateHourEnd;
        this.dateHourCreation = properties.dateHourCreation;
        this.eventMaxNbPlaces = properties.eventMaxNbPlaces;
        this.eventPitureId = properties.eventPitureId;
        this.picture = properties.picture;
        this.statusId = properties.statusId;
        this.creatorId = properties.creatorId;
        this.zoneId = properties.zoneId;
        this.zone = properties.zone;
    }
}