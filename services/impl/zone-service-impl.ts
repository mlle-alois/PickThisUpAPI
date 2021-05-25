import {
    ZoneController,
    ZoneGetAllOptions,
    ZoneUpdateOptions
} from "../../controllers";
import {LogError, ZoneModel, UserModel, MediaModel} from "../../models";
import {Connection} from "mysql2/promise";
import {ZoneService} from "../zone-service";
import {UserServiceImpl} from "./user-service-impl";
import {StatusServiceImpl} from "./status-service-impl";
import {MediaServiceImpl} from "./media-service-impl";

/**
 * Zone = Signalement
 */
export class ZoneServiceImpl implements ZoneService {

    private connection: Connection;
    private zoneController: ZoneController;
    private userService: UserServiceImpl;
    private statusService: StatusServiceImpl;
    private mediaService: MediaServiceImpl;

    constructor(connection: Connection) {
        this.connection = connection;
        this.zoneController = new ZoneController(this.connection);
        this.userService = new UserServiceImpl(this.connection);
        this.statusService = new StatusServiceImpl(this.connection);
        this.mediaService = new MediaServiceImpl(this.connection);
    }

    /**
     * Récupération de toutes les zones disponibles :
     * validées ou en attente pour celles de l'utilisateur connecté
     * pas encore associées à un événement validé ou en attente
     * @param userMail
     * @param options -> Limit et offset de la requete
     */
    async getAllAvailableZones(userMail: string, options?: ZoneGetAllOptions): Promise<ZoneModel[] | LogError> {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return this.zoneController.getAllAvailableZones(userMail, options);
    }

    /**
     * Récupération de l'id de zone maximum existant
     */
    async getMaxZoneId(): Promise<number> {
        return this.zoneController.getMaxZoneId();
    }

    /**
     * Récupération d'un événement depuis son :
     * @param zoneId
     */
    getZoneById(zoneId: number): Promise<ZoneModel | LogError> {
        return this.zoneController.getZoneById(zoneId);
    }

    /**
     * Création d'une zone
     * @param options
     */
    async createZone(options: ZoneModel): Promise<ZoneModel | LogError> {
        const signalman = await this.userService.getUserByMail(options.signalmanId);
        if (signalman instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        const status = await this.statusService.getStatusById(options.statusId);
        if (status instanceof LogError)
            return new LogError({numError: 404, text: "Status don't exists"});

        return this.zoneController.createZone(options);
    }

    /**
     * suppression d'une zone selon son id
     * @param zoneId
     */
    async deleteZoneById(zoneId: number): Promise<boolean> {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof LogError)
            return false;

        return this.zoneController.deleteZonesById(zoneId);
    }

    /**
     * Modification des informations d'unr zone renseignées dans les options
     * @param options
     */
    async updateZone(options: ZoneUpdateOptions): Promise<ZoneModel | LogError> {
        return await this.zoneController.updateZone(options);
    }

    /**
     * récupérer les zones d'un utilisateur
     * @param userMail
     */
    async getZonesByUser(userMail: string): Promise<ZoneModel[] | LogError> {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        return await this.zoneController.getZonesByUser(userMail);
    }

    /**
     * récupérer les zones d'un utilisateur selon leur statut
     * @param userMail
     * @param statusId
     */
    async getZonesByUserAndStatus(userMail: string, statusId: number): Promise<ZoneModel[] | LogError> {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof LogError)
            return new LogError({numError: 404, text: "User don't exists"});

        const status = await this.statusService.getStatusById(statusId);
        if (status instanceof LogError)
            return new LogError({numError: 404, text: "Status don't exists"});

        return await this.zoneController.getZonesByUserAndStatus(userMail, statusId);
    }

    /**
     * accepter une zone
     * @param zoneId
     */
    async acceptZone(zoneId: number): Promise<ZoneModel | LogError> {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof LogError)
            return new LogError({numError: 404, text: "Zone don't exists"});

        return await this.zoneController.acceptZone(zoneId);
    }

    /**
     * refuser une zone
     * @param zoneId
     */
    async refuseZone(zoneId: number): Promise<ZoneModel | LogError> {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof LogError)
            return new LogError({numError: 404, text: "Zone don't exists"});

        return await this.zoneController.refuseZone(zoneId);
    }

    /**
     * Création d'un media
     * @param options
     * @param zoneId
     */
    async addMediaToZone(options: MediaModel, zoneId: number): Promise<MediaModel | LogError> {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof LogError)
            return new LogError({numError: 404, text: "Zone don't exists"});

        const media = await this.mediaService.createMedia(options);
        if(media instanceof LogError)
            return media;

        return this.zoneController.addMediaToZone(media.mediaId, zoneId);
    }

    /**
     * suppression d'un media selon son id
     * @param mediaId
     * @param zoneId
     */
    async removeMediaToZone(mediaId: number, zoneId: number): Promise<boolean> {
        const media = await this.mediaService.getMediaById(mediaId);
        if (media instanceof LogError)
            return false;

        const zone = await this.getZoneById(zoneId);
        if (zone instanceof LogError)
            return false;

        const success = this.zoneController.removeMediaToZone(mediaId, zoneId);
        if(!success)
            return false;

        return this.mediaService.deleteMedia(mediaId);
    }

}