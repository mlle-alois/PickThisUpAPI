import {TicketModel, LogError} from "../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";

export interface TicketGetAllOptions {
    limit?: number;
    offset?: number;
}

export interface TicketUpdateOptions {
    ticketId: number;
    ticketName: string;
    ticketDescription: string;
    ticketClosingDate: Date;
    statusId: number;
    priorityId: number;
}

export class TicketController {

    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getAllTickets(options?: TicketGetAllOptions): Promise<TicketModel[]> {
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;

        const res = await this.connection.query(`SELECT ticket_id,
                                                        ticket_name,
                                                        ticket_description,
                                                        ticket_creation_date,
                                                        ticket_closing_date,
                                                        status_id,
                                                        priority_id,
                                                        creator_id
                                                 FROM TICKET LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new TicketModel({
                    ticketId: row["ticket_id"],
                    ticketName: row["ticket_name"],
                    ticketDescription: row["ticket_description"],
                    ticketCreationDate: row["ticket_creation_date"],
                    ticketClosingDate: row["ticket_deadline"],
                    statusId: row["status_id"],
                    priorityId: row["priority_id"],
                    creatorId: row["creator_id"]
                });
            });
        }
        return [];
    }

    async getTicketsByStatusId(id: number): Promise<TicketModel[]> {
        const res = await this.connection.query(`SELECT ticket_id,
                                                        ticket_name,
                                                        ticket_description,
                                                        ticket_creation_date,
                                                        ticket_closing_date,
                                                        status_id,
                                                        priority_id,
                                                        creator_id
                                                 FROM TICKET 
                                                 WHERE status_id = ?`, [
            id
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new TicketModel({
                    ticketId: row["ticket_id"],
                    ticketName: row["ticket_name"],
                    ticketDescription: row["ticket_description"],
                    ticketCreationDate: row["ticket_creation_date"],
                    ticketClosingDate: row["ticket_deadline"],
                    statusId: row["status_id"],
                    priorityId: row["priority_id"],
                    creatorId: row["creator_id"]
                });
            });
        }
        return [];
    }

    async getTicketById(ticketId: number): Promise<TicketModel | LogError> {
        const res = await this.connection.query(`SELECT ticket_id,
                                                        ticket_name,
                                                        ticket_description,
                                                        ticket_creation_date,
                                                        ticket_closing_date,
                                                        status_id,
                                                        priority_id,
                                                        creator_id
                                                 FROM TICKET
                                                 where ticket_id = ?`, [
            ticketId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                return new TicketModel({
                    ticketId: row["ticket_id"],
                    ticketName: row["ticket_name"],
                    ticketDescription: row["ticket_description"],
                    ticketCreationDate: row["ticket_creation_date"],
                    ticketClosingDate: row["ticket_deadline"],
                    statusId: row["status_id"],
                    priorityId: row["priority_id"],
                    creatorId: row["creator_id"]
                });
            }
        }
        return new LogError({numError: 404, text: "Ticket not found"});
    }

    async getMaxTicketId(): Promise<number> {
        const res = await this.connection.query('SELECT MAX(ticket_id) as maxId FROM TICKET');
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if (rows.length > 0) {
                const row = rows[0];
                if (row["maxId"] === null) {
                    return 0;
                } else {
                    return row["maxId"];
                }
            }
        }
        return 0;
    }

    async createTicket(options: TicketModel): Promise<TicketModel | LogError> {
        try {
            await this.connection.execute(`INSERT INTO TICKET (ticket_id,
                                                               ticket_name,
                                                               ticket_description,
                                                               ticket_creation_date,
                                                               ticket_closing_date,
                                                               status_id,
                                                               priority_id,
                                                               creator_id)
                                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                options.ticketId,
                options.ticketName,
                options.ticketDescription,
                options.ticketCreationDate,
                options.ticketClosingDate,
                options.statusId,
                options.priorityId,
                options.creatorId
            ]);
            //récupération de la ticket créée ou null si cela n'a pas fonctionné
            return await this.getTicketById(options.ticketId);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during ticket creation"});
        }
    }

    async deleteTicketsById(ticketId: number): Promise<boolean> {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM TICKET
                                                     WHERE ticket_id = ?`, [
                ticketId
            ]);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async updateTicket(options: TicketUpdateOptions): Promise<TicketModel | LogError> {
        const setClause: string[] = [];
        const params = [];
        //création des contenus de la requête dynamiquement
        if (options.ticketName !== undefined) {
            setClause.push("ticket_name = ?");
            params.push(options.ticketName);
        }
        if (options.ticketDescription !== undefined) {
            setClause.push("ticket_description = ?");
            params.push(options.ticketDescription);
        }
        if (options.ticketClosingDate !== undefined) {
            setClause.push("ticket_closing_date = ?");
            params.push(options.ticketClosingDate);
        }
        if (options.statusId !== undefined) {
            setClause.push("status_id = ?");
            params.push(options.statusId);
        }
        if (options.priorityId !== undefined) {
            setClause.push("priority_id = ?");
            params.push(options.priorityId);
        }
        params.push(options.ticketId);
        try {
            const res = await this.connection.execute(`UPDATE TICKET SET ${setClause.join(", ")} WHERE ticket_id = ?`, params);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getTicketById(options.ticketId);
            }
            return new LogError({numError: 400, text: "The ticket update failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "The ticket update failed"});
        }
    }

    async searchTicket(search: string): Promise<TicketModel[] | LogError> {

        const res = await this.connection.query(`SELECT ticket_id,
                                                        ticket_name,
                                                        ticket_description,
                                                        ticket_creation_date,
                                                        ticket_closing_date,
                                                        TICKET.status_id,
                                                        TICKET.priority_id,
                                                        creator_id
                                                 FROM TICKET
                                                          JOIN USER ON USER.user_mail = TICKET.creator_id
                                                          JOIN STATUS ON STATUS.status_id = TICKET.status_id
                                                          JOIN PRIORITY ON PRIORITY.priority_id = TICKET.priority_id
                                                 WHERE ticket_id LIKE '%${search}%'
                                                    OR ticket_name LIKE '%${search}%'
                                                    OR ticket_description LIKE '%${search}%'
                                                    OR ticket_creation_date LIKE '%${search}%'
                                                    OR ticket_closing_date LIKE '%${search}%'
                                                    OR user_name LIKE '%${search}%'
                                                    OR user_firstname LIKE '%${search}%'
                                                    OR status_libelle LIKE '%${search}%'
                                                    OR priority_libelle LIKE '%${search}%'`);
        const data = res[0];
        if (Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function (row: any) {
                return new TicketModel({
                    ticketId: row["ticket_id"],
                    ticketName: row["ticket_name"],
                    ticketDescription: row["ticket_description"],
                    ticketCreationDate: row["ticket_creation_date"],
                    ticketClosingDate: row["ticket_deadline"],
                    statusId: row["status_id"],
                    priorityId: row["priority_id"],
                    creatorId: row["creator_id"]
                });
            });
        }
        return new LogError({numError: 404, text: "No result"});
    }

    async openTicket(id: number): Promise<TicketModel | LogError> {
        try {
            const res = await this.connection.execute(`UPDATE TICKET
                                                       SET status_id = 1
                                                       WHERE ticket_id = ?`, [
                id
            ]);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getTicketById(id);
            }
            return new LogError({numError: 400, text: "Ticket opening failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "Ticket opening failed"});
        }
    }

    async closeTicket(id: number): Promise<TicketModel | LogError> {
        try {
            const res = await this.connection.execute(`UPDATE TICKET
                                                       SET status_id = 2
                                                       WHERE ticket_id = ?`, [
                id
            ]);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getTicketById(id);
            }
            return new LogError({numError: 400, text: "Ticket closure failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "Ticket closure failed"});
        }
    }

    async archiveTicket(id: number): Promise<TicketModel | LogError> {
        try {
            const res = await this.connection.execute(`UPDATE TICKET
                                                       SET status_id = 3
                                                       WHERE ticket_id = ?`, [
                id
            ]);
            const headers = res[0] as ResultSetHeader;
            if (headers.affectedRows > 0) {
                return this.getTicketById(id);
            }
            return new LogError({numError: 400, text: "Ticket archive failed"});
        } catch (err) {
            console.error(err);
            return new LogError({numError: 400, text: "Ticket archive failed"});
        }
    }
}