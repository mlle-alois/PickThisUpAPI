import {TicketController, TicketGetAllOptions, TicketUpdateOptions} from "../../controllers";
import {LogError, TicketModel, UserModel} from "../../models";
import {Connection} from "mysql2/promise";
import {TicketService} from "../ticket-service";
import {UserServiceImpl} from "./user-service-impl";
import {StatusServiceImpl} from "./status-service-impl";
import {PriorityServiceImpl} from "./priority-service-impl";

export class TicketServiceImpl implements TicketService {

    private connection: Connection;
    private ticketController: TicketController;
    private statusService: StatusServiceImpl;
    private priorityService: PriorityServiceImpl;
    private userService: UserServiceImpl;

    constructor(connection: Connection) {
        this.connection = connection;
        this.ticketController = new TicketController(this.connection);
        this.statusService = new StatusServiceImpl(this.connection);
        this.priorityService = new PriorityServiceImpl(this.connection);
        this.userService = new UserServiceImpl(this.connection);
    }

    /**
     * Récupération de tous les tickets
     * @param options -> Limit et offset de la requete
     */
    async getAllTickets(options?: TicketGetAllOptions): Promise<TicketModel[]> {
        return this.ticketController.getAllTickets(options);
    }

    /**
     * Récupération de tous les tickets selon un statut
     * @param status
     */
    async getTicketsByStatus(status: string): Promise<TicketModel[]> {
        const st = await this.statusService.getStatusByName(status);
        if(st instanceof LogError)
            return [];

        return this.ticketController.getTicketsByStatusId(st.statusId);
    }

    /**
     * Récupération de l'id du ticket maximum existant
     */
    async getMaxTicketId(): Promise<number> {
        return this.ticketController.getMaxTicketId();
    }

    /**
     * Récupération d'un ticket depuis son :
     * @param ticketId
     */
    getTicketById(ticketId: number): Promise<TicketModel | LogError> {
        return this.ticketController.getTicketById(ticketId);
    }

    /**
     * Création d'un ticket
     * @param options
     */
    async createTicket(options: TicketModel): Promise<TicketModel | LogError> {
        if(options.statusId !== null) {
            const status = await this.statusService.getStatusById(options.statusId as number);
            if (status instanceof LogError)
                return new LogError({numError: 404, text: "Status not exists"});
        }
        if(options.priorityId !== null) {
            const priority = await this.priorityService.getPriorityById(options.priorityId as number);
            if (priority instanceof LogError)
                return new LogError({numError: 404, text: "Priority not exists"});
        }
        const creator = await this.userService.getUserByMail(options.creatorId);
        if (creator instanceof LogError)
            return new LogError({numError: 404, text: "Creator not exists"});

        return this.ticketController.createTicket(options);
    }

    /**
     * récupération des membres d'un ticket
     * @param ticketId
     */
    async getMembersByTicketId(ticketId: number): Promise<UserModel[]> {
        const ticket = await this.ticketController.getTicketById(ticketId);
        if (ticket instanceof LogError)
            return [];

        return await this.ticketController.getMembersByTicketId(ticketId);
    }

    /**
     * suppression d'un ticket selon son id
     * @param ticketId
     */
    async deleteTicketById(ticketId: number): Promise<boolean> {
        const ticket = await this.ticketController.getTicketById(ticketId);
        if (ticket instanceof LogError)
            return false;

        return await this.ticketController.deleteTicketsById(ticketId);
    }

    /**
     * Modification des informations d'un ticket renseignées dans les options
     * En cas de modification de liste, la position dans la liste est modifiée à la plus élevée existante
     * @param options
     */
    async updateTicket(options: TicketUpdateOptions): Promise<TicketModel | LogError> {
        const ticket = await this.ticketController.getTicketById(options.ticketId);
        if (ticket instanceof LogError)
            return new LogError({numError: 404, text: "Ticket not exists"});

        if(options.priorityId !== undefined) {
            const priority = await this.priorityService.getPriorityById(options.priorityId as number);
            if (priority instanceof LogError)
                return new LogError({numError: 404, text: "Priority not exists"});
        }

        return  await this.ticketController.updateTicket(options);
    }

    /**
     * recherche d'un ticket via mot clé parmi tous les champs des tickets
     * @param search
     */
    async searchTickets(search: string): Promise<TicketModel[] | LogError> {
        return await this.ticketController.searchTicket(search);
    }

    /**
     * (ré)ouverture d'un ticket selon son id
     * @param id
     */
    async openTicket(id: number): Promise<TicketModel | LogError> {
        const ticket = await this.ticketController.getTicketById(id);
        if (ticket instanceof LogError)
            return new LogError({numError: 404, text: "Ticket not exists"});

        return  await this.ticketController.openTicket(id);
    }

    /**
     * fermeture d'un ticket selon son id
     * @param id
     */
    async closeTicket(id: number): Promise<TicketModel | LogError> {
        const ticket = await this.ticketController.getTicketById(id);
        if (ticket instanceof LogError)
            return new LogError({numError: 404, text: "Ticket not exists"});

        return  await this.ticketController.closeTicket(id);
    }

    /**
     * archivage d'un ticket selon son id
     * @param id
     */
    async archiveTicket(id: number): Promise<TicketModel | LogError> {
        const ticket = await this.ticketController.getTicketById(id);
        if (ticket instanceof LogError)
            return new LogError({numError: 404, text: "Ticket not exists"});

        return  await this.ticketController.archiveTicket(id);
    }

}