"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const models_1 = require("../models");
const user_controller_1 = require("./user-controller");
class TicketController {
    constructor(connection) {
        this.connection = connection;
    }
    async getAllTickets(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT ticket_id,
                                                        ticket_name,
                                                        ticket_description,
                                                        ticket_creation_date,
                                                        ticket_closing_date,
                                                        STATUS.status_id,
                                                        status_libelle,
                                                        priority_id,
                                                        creator_id
                                                 FROM TICKET
                                                          JOIN STATUS ON TICKET.status_id = STATUS.status_id LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.TicketModel({
                    ticketId: row["ticket_id"],
                    ticketName: row["ticket_name"],
                    ticketDescription: row["ticket_description"],
                    ticketCreationDate: row["ticket_creation_date"],
                    ticketClosingDate: row["ticket_closing_date"],
                    statusId: row["status_id"],
                    statusLibelle: row["status_libelle"],
                    priorityId: row["priority_id"],
                    creatorId: row["creator_id"]
                });
            });
        }
        return [];
    }
    async getTicketsByStatusId(id) {
        const res = await this.connection.query(`SELECT ticket_id,
                                                        ticket_name,
                                                        ticket_description,
                                                        ticket_creation_date,
                                                        ticket_closing_date,
                                                        STATUS.status_id,
                                                        status_libelle,
                                                        priority_id,
                                                        creator_id
                                                 FROM TICKET
                                                          JOIN STATUS ON TICKET.status_id = STATUS.status_id
                                                 WHERE TICKET.status_id = ?`, [
            id
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.TicketModel({
                    ticketId: row["ticket_id"],
                    ticketName: row["ticket_name"],
                    ticketDescription: row["ticket_description"],
                    ticketCreationDate: row["ticket_creation_date"],
                    ticketClosingDate: row["ticket_deadline"],
                    statusId: row["status_id"],
                    statusLibelle: row["status_libelle"],
                    priorityId: row["priority_id"],
                    creatorId: row["creator_id"]
                });
            });
        }
        return [];
    }
    async getTicketById(ticketId) {
        const res = await this.connection.query(`SELECT ticket_id,
                                                        ticket_name,
                                                        ticket_description,
                                                        ticket_creation_date,
                                                        ticket_closing_date,
                                                        STATUS.status_id,
                                                        status_libelle,
                                                        priority_id,
                                                        creator_id
                                                 FROM TICKET
                                                          JOIN STATUS ON TICKET.status_id = STATUS.status_id
                                                 where TICKET.ticket_id = ?`, [
            ticketId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.TicketModel({
                    ticketId: row["ticket_id"],
                    ticketName: row["ticket_name"],
                    ticketDescription: row["ticket_description"],
                    ticketCreationDate: row["ticket_creation_date"],
                    ticketClosingDate: row["ticket_deadline"],
                    statusId: row["status_id"],
                    statusLibelle: row["status_libelle"],
                    priorityId: row["priority_id"],
                    creatorId: row["creator_id"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "Ticket not found" });
    }
    async getMaxTicketId() {
        const res = await this.connection.query('SELECT MAX(ticket_id) as maxId FROM TICKET');
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                if (row["maxId"] === null) {
                    return 0;
                }
                else {
                    return row["maxId"];
                }
            }
        }
        return 0;
    }
    async createTicket(options) {
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
            return await this.getTicketById(options.ticketId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during ticket creation" });
        }
    }
    async deleteTicketsById(ticketId) {
        try {
            const res = await this.connection.query(`DELETE
                                                     FROM TICKET
                                                     WHERE ticket_id = ?`, [
                ticketId
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
    async updateTicket(options) {
        const setClause = [];
        const params = [];
        if (options.ticketName !== undefined) {
            setClause.push("ticket_name = ?");
            params.push(options.ticketName);
        }
        if (options.ticketDescription !== undefined) {
            setClause.push("ticket_description = ?");
            params.push(options.ticketDescription);
        }
        if (options.priorityId !== undefined) {
            setClause.push("priority_id = ?");
            params.push(options.priorityId);
        }
        params.push(options.ticketId);
        try {
            const res = await this.connection.execute(`UPDATE TICKET SET ${setClause.join(", ")} WHERE ticket_id = ?`, params);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getTicketById(options.ticketId);
            }
            return new models_1.LogError({ numError: 400, text: "The ticket update failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "The ticket update failed" });
        }
    }
    async searchTicket(search) {
        const res = await this.connection.query(`SELECT ticket_id,
                                                        ticket_name,
                                                        ticket_description,
                                                        ticket_creation_date,
                                                        ticket_closing_date,
                                                        TICKET.status_id,
                                                        TICKET.priority_id,
                                                        creator_id
                                                 FROM TICKET
                                                          JOIN ${user_controller_1.UserController.userTable} ON ${user_controller_1.UserController.userTable}.user_mail = TICKET.creator_id
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
            return data.map(function (row) {
                return new models_1.TicketModel({
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
        return new models_1.LogError({ numError: 404, text: "No result" });
    }
    async getMembersByTicketId(ticketId) {
        const res = await this.connection.query(`SELECT user_mail,
                                                        user_password,
                                                        user_name,
                                                        user_firstname,
                                                        user_phone_number,
                                                        profile_picture_id,
                                                        user_type_id
                                                 FROM ${user_controller_1.UserController.userTable}
                                                          JOIN PARTICIPATE_USER_TICKET
                                                               ON PARTICIPATE_USER_TICKET.user_id = ${user_controller_1.UserController.userTable}.user_mail
                                                 where ticket_id = ?`, [
            ticketId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.UserModel({
                    mail: row["user_mail"],
                    password: row["user_password"],
                    firstname: row["user_firstname"],
                    name: row["user_name"],
                    phoneNumber: row["user_phone_number"],
                    profilePictureId: row["profile_picture_id"],
                    typeId: row["user_type_id"]
                });
            });
        }
        return [];
    }
    async openTicket(id) {
        try {
            const res = await this.connection.execute(`UPDATE TICKET
                                                       SET status_id           = 1,
                                                           ticket_closing_date = null
                                                       WHERE ticket_id = ?`, [
                id
            ]);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getTicketById(id);
            }
            return new models_1.LogError({ numError: 400, text: "Ticket opening failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "Ticket opening failed" });
        }
    }
    async closeTicket(id) {
        try {
            const res = await this.connection.execute(`UPDATE TICKET
                                                       SET status_id           = 2,
                                                           ticket_closing_date = NOW()
                                                       WHERE ticket_id = ?`, [
                id
            ]);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getTicketById(id);
            }
            return new models_1.LogError({ numError: 400, text: "Ticket closure failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "Ticket closure failed" });
        }
    }
    async archiveTicket(id) {
        try {
            const res = await this.connection.execute(`UPDATE TICKET
                                                       SET status_id           = 3,
                                                           ticket_closing_date = NOW()
                                                       WHERE ticket_id = ?`, [
                id
            ]);
            const headers = res[0];
            if (headers.affectedRows > 0) {
                return this.getTicketById(id);
            }
            return new models_1.LogError({ numError: 400, text: "Ticket archive failed" });
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 400, text: "Ticket archive failed" });
        }
    }
    async assignUserToTicket(ticketId, userMail) {
        try {
            await this.connection.execute(`INSERT INTO PARTICIPATE_USER_TICKET (user_id, ticket_id)
                                           VALUES (?, ?)`, [
                userMail, ticketId
            ]);
            return await this.getTicketById(ticketId);
        }
        catch (err) {
            console.error(err);
            return new models_1.LogError({ numError: 500, text: "Error during assignation" });
        }
    }
    async unassignUserToTicket(ticketId, userMail) {
        try {
            const res = await this.connection.execute(`DELETE
                                           FROM PARTICIPATE_USER_TICKET
                                           WHERE ticket_id = ?
                                             AND user_id = ?`, [
                ticketId, userMail
            ]);
            const headers = res[0];
            return headers.affectedRows > 0;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}
exports.TicketController = TicketController;
//# sourceMappingURL=ticket-controller.js.map