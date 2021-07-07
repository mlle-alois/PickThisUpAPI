import {LogError, EventModel, UserModel} from "../models";
import {EventGetAllOptions, IUserCreationProps} from "../controllers";

export interface EventService {

    getAllValidatedEvents(options?: EventGetAllOptions): Promise<EventModel[]>;

    getMaxEventId(): Promise<number>;

    getEventById(eventId: number): Promise<EventModel | LogError>;

    createEvent(options: EventModel): Promise<EventModel | LogError>;

    deleteEventsById(eventId: number): Promise<boolean>;

    updateEvent(options: EventModel): Promise<EventModel | LogError>;
    
    registerEvent(eventId: number, userMail: string): Promise<UserModel[] | LogError>;

    unregisterEvent(eventId: number, userMail: string): Promise<UserModel[] | LogError>;

    getPastEventsByUser(userMail: string): Promise<EventModel[] | LogError>;

    getFutureEventsByUser(userMail: string): Promise<EventModel[] | LogError>;

    getActualEventsByUser(userMail: string): Promise<EventModel[] | LogError>;

    getValidatedEvents(): Promise<EventModel[]>;

    getWaitingEvents(): Promise<EventModel[]>;

    getRefusedEvents(): Promise<EventModel[]>;

    acceptEvent(eventId: number): Promise<EventModel | LogError>;

    refuseEvent(eventId: number): Promise<EventModel | LogError>;

    getParticipantsEvent(eventId: number): Promise<UserModel[] | LogError>;
}