import {
    EventController,
    EventGetAllOptions,
    EventUpdateOptions
} from "../../controllers";
import {LogError, EventModel, UserModel} from "../../models";
import {Connection} from "mysql2/promise";
import {EventService} from "../event-service";
import {UserServiceImpl} from "./user-service-impl";
import {StatusServiceImpl} from "./status-service-impl";
import {MediaServiceImpl} from "./media-service-impl";

export class EventServiceImpl implements EventService {

    private connection: Connection;
    private eventController: EventController;
    private userService: UserServiceImpl;
    private statusService: StatusServiceImpl;
    private mediaServcice: MediaServiceImpl;

    constructor(connection: Connection) {
        this.connection = connection;
        this.eventController = new EventController(this.connection);
        this.userService = new UserServiceImpl(this.connection);
        this.statusService = new StatusServiceImpl(this.connection);
        this.mediaServcice = new MediaServiceImpl(this.connection);
    }

    /**
     * Récupération de tous les tableaux
     * @param options -> Limit et offset de la requete
     */
    async getAllEvents(options?: EventGetAllOptions): Promise<EventModel[]> {
        return this.eventController.getAllEvents(options);
    }

    /**
     * Récupération de l'id de event maximum existant
     */
    async getMaxEventId(): Promise<number> {
        return this.eventController.getMaxEventId();
    }

    /**
     * Récupération d'un événement depuis son :
     * @param eventId
     */
    getEventById(eventId: number): Promise<EventModel | LogError> {
        return this.eventController.getEventById(eventId);
    }

    /**
     * Création d'un event
     * @param options
     */
    async createEvent(options: EventModel): Promise<EventModel | LogError> {
        const status = await this.statusService.getStatusById(options.statusId);
        if (status instanceof LogError)
            return new LogError({numError: 404, text: "Status don't exists"});

        const picture = await this.mediaServcice.getMediaById(options.eventPitureId);
        if(picture instanceof LogError)
            return new LogError({numError: 404, text: "Picture don't exists"});
        //TODO vérifier valeur existante zone

        return this.eventController.createEvent(options);
    }

    /**
     * suppression deu événement selon son id
     * @param eventId
     */
    async deleteEventsById(eventId: number): Promise<boolean> {
        const event = await this.getEventById(eventId);
        if (event instanceof LogError)
            return false;

        return this.eventController.deleteEventsById(eventId);
    }

    /**
     * Modification des informations d'un événement renseignées dans les options
     * @param options
     */
    async updateEvent(options: EventUpdateOptions): Promise<EventModel | LogError> {
        if(options.eventPitureId !== undefined) {
            const picture = await this.mediaServcice.getMediaById(options.eventPitureId);
            if(picture instanceof LogError)
                return new LogError({numError: 404, text: "Picture don't exists"});
        }

        return await this.eventController.updateEvent(options);
    }

    /**
     * s'inscrire à un événement
     * @param eventId
     * @param userMail
     */
    async registerEvent(eventId: number, userMail: string): Promise<UserModel[] | LogError> {
        const event = await this.getEventById(eventId);
        if (event instanceof LogError)
            return new LogError({numError: 404, text: "Event don't exists"});

        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.eventController.registerEvent(eventId, userMail);
    }

    /**
     * se désinscrire d'un événement
     * @param eventId
     * @param userMail
     */
    async unregisterEvent(eventId: number, userMail: string): Promise<UserModel[] | LogError> {
        const event = await this.getEventById(eventId);
        if (event instanceof LogError)
            return new LogError({numError: 404, text: "Event don't exists"});

        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.eventController.unregisterEvent(eventId, userMail);
    }

    /**
     * récupérer les événements passés d'un utilisateur
     * @param userMail
     */
    async getPastEventsByUser(userMail: string): Promise<EventModel[] | LogError> {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.eventController.getPastEventsByUser(userMail);
    }

    /**
     * récupérer les événements futurs d'un utilisateur
     * @param userMail
     */
    async getFutureEventsByUser(userMail: string): Promise<EventModel[] | LogError> {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.eventController.getFutureEventsByUser(userMail);
    }

    /**
     * récupérer les événements en cours d'un utilisateur
     * @param userMail
     */
    async getActualEventsByUser(userMail: string): Promise<EventModel[] | LogError> {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.eventController.getActualEventsByUser(userMail);
    }

    /**
     * accepter un événement
     * @param eventId
     */
    async acceptEvent(eventId: number): Promise<EventModel | LogError> {
        const event = await this.getEventById(eventId);
        if (event instanceof LogError)
            return new LogError({numError: 404, text: "Event don't exists"});

        return await this.eventController.acceptEvent(eventId);
    }

    /**
     * refuser un événement
     * @param eventId
     */
    async refuseEvent(eventId: number): Promise<EventModel | LogError> {
        const event = await this.getEventById(eventId);
        if (event instanceof LogError)
            return new LogError({numError: 404, text: "Event don't exists"});

        return await this.eventController.refuseEvent(eventId);
    }

    /**
     * récupérer tous les participants d'un événement
     * @param eventId
     */
    async getParticipantsEvent(eventId: number): Promise<UserModel[] | LogError> {
        const event = await this.getEventById(eventId);
        if (event instanceof LogError)
            return new LogError({numError: 404, text: "Event don't exists"});

        return await this.eventController.getParticipantsEvent(eventId);
    }

}