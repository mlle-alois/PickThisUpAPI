import {
    CarpoolController,
    CarpoolUpdateOptions
} from "../../controllers";
import {LogError, CarpoolModel, UserModel} from "../../models";
import {Connection} from "mysql2/promise";
import {CarpoolService} from "../carpool-service";
import {UserServiceImpl} from "./user-service-impl";
import {EventServiceImpl} from "./event-service-impl";

export class CarpoolServiceImpl implements CarpoolService {

    private connection: Connection;
    private carpoolController: CarpoolController;
    private userService: UserServiceImpl;
    private eventService: EventServiceImpl;

    constructor(connection: Connection) {
        this.connection = connection;
        this.carpoolController = new CarpoolController(this.connection);
        this.userService = new UserServiceImpl(this.connection);
        this.eventService = new EventServiceImpl(this.connection);
    }

    /**
     * Récupération de l'id de carpool maximum existant
     */
    async getMaxCarpoolId(): Promise<number> {
        return this.carpoolController.getMaxCarpoolId();
    }

    /**
     * Récupération d'un covoiturage depuis son :
     * @param carpoolId
     */
    getCarpoolById(carpoolId: number): Promise<CarpoolModel | LogError> {
        return this.carpoolController.getCarpoolById(carpoolId);
    }

    /**
     * Création d'un carpool
     * @param options
     */
    async createCarpool(options: CarpoolModel): Promise<CarpoolModel | LogError> {
        const event = await this.eventService.getEventById(options.eventId);
        if (event instanceof LogError)
            return new LogError({numError: 404, text: "Event don't exists"});

        const conductor = await this.userService.getUserByMail(options.conductorId);
        if (conductor instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return this.carpoolController.createCarpool(options);
    }

    /**
     * suppression d'un covoiturage selon son id
     * @param carpoolId
     */
    async deleteCarpoolById(carpoolId: number): Promise<boolean> {
        const carpool = await this.getCarpoolById(carpoolId);
        if (carpool instanceof LogError)
            return false;

        return this.carpoolController.deleteCarpoolsById(carpoolId);
    }

    /**
     * Modification des informations d'un covoiturage renseignées dans les options
     * @param options
     */
    async updateCarpool(options: CarpoolUpdateOptions): Promise<CarpoolModel | LogError> {
        return await this.carpoolController.updateCarpool(options);
    }

    /**
     * s'inscrire à un covoiturage
     * @param carpoolId
     * @param userMail
     */
    async registerCarpool(carpoolId: number, userMail: string): Promise<UserModel[] | LogError> {
        const carpool = await this.getCarpoolById(carpoolId);
        if (carpool instanceof LogError)
            return new LogError({numError: 404, text: "Carpool don't exists"});

        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.carpoolController.registerCarpool(carpoolId, userMail);
    }

    /**
     * se désinscrire d'un covoiturage
     * @param carpoolId
     * @param userMail
     */
    async unregisterCarpool(carpoolId: number, userMail: string): Promise<UserModel[] | LogError> {
        const carpool = await this.getCarpoolById(carpoolId);
        if (carpool instanceof LogError)
            return new LogError({numError: 404, text: "Carpool don't exists"});

        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.carpoolController.unregisterCarpool(carpoolId, userMail);
    }

    /**
     * récupérer les covoiturages d'un événement
     * @param eventId
     */
    async getCarpoolsByEvent(eventId: number): Promise<CarpoolModel[] | LogError> {
        const event = await this.eventService.getEventById(eventId);
        if (event instanceof LogError)
            return new LogError({numError: 404, text: "Event don't exists"});

        return await this.carpoolController.getCarpoolsByEvent(eventId);
    }

    /**
     * récupérer les membres d'un covoiturage
     * @param carpoolId
     */
    async getCarpoolMembersById(carpoolId: number): Promise<UserModel[] | LogError> {
        const carpool = await this.getCarpoolById(carpoolId);
        if (carpool instanceof LogError)
            return new LogError({numError: 404, text: "Carpool don't exists"});

        return await this.carpoolController.getCarpoolMembersById(carpoolId);
    }

    /**
     * récupérer les anciennes adresses de covoiturage d'un utilisateur
     * @param userMail
     */
    async getOldAdressesCarpoolByUser(userMail: string): Promise<String[] | LogError> {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.carpoolController.getOldAdressesCarpoolByUser(userMail);
    }

}