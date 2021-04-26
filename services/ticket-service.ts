import {LogError, TicketModel} from "../models";
import {TicketGetAllOptions, TicketUpdateOptions} from "../controllers";

export interface TicketService {

    getAllTickets(options?: TicketGetAllOptions): Promise<TicketModel[]>;

    getMaxTicketId(): Promise<number>;

    getTicketById(ticketId: number): Promise<TicketModel | LogError>;

    createTicket(options: TicketModel): Promise<TicketModel | LogError>;

    deleteTicketById(ticketId: number): Promise<boolean>;

    updateTicket(options: TicketUpdateOptions): Promise<TicketModel | LogError>;

    searchTickets(search: string): Promise<TicketModel[] | LogError>;

    openTicket(id: number): Promise<TicketModel | LogError>;

    closeTicket(id: number): Promise<TicketModel | LogError>;

    archiveTicket(id: number): Promise<TicketModel | LogError>;
}