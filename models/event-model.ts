export interface IEventProps {
    eventId: number;
    eventTitle: string;
    eventDescription: string;
    dateHourStart: Date;
    dateHourEnd: Date;
    dateHourCreation: Date;
    eventMaxNbPlaces: number;
    eventPitureId: number;
    statusId: number;
    creatorId: string;
    zoneId: number;
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
    statusId: number;
    creatorId: string;
    zoneId: number;

    constructor(properties: IEventProps) {
        this.eventId = properties.eventId;
        this.eventTitle = properties.eventTitle;
        this.eventDescription = properties.eventDescription;
        this.dateHourStart = properties.dateHourStart;
        this.dateHourEnd = properties.dateHourEnd;
        this.dateHourCreation = properties.dateHourCreation;
        this.eventMaxNbPlaces = properties.eventMaxNbPlaces;
        this.eventPitureId = properties.eventPitureId;
        this.statusId = properties.statusId;
        this.creatorId = properties.creatorId;
        this.zoneId = properties.zoneId;
    }
}