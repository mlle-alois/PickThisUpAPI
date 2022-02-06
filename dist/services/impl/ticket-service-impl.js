"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketServiceImpl = void 0;
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const user_service_impl_1 = require("./user-service-impl");
const status_service_impl_1 = require("./status-service-impl");
const priority_service_impl_1 = require("./priority-service-impl");
class TicketServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.ticketController = new controllers_1.TicketController(this.connection);
        this.statusService = new status_service_impl_1.StatusServiceImpl(this.connection);
        this.priorityService = new priority_service_impl_1.PriorityServiceImpl(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
    }
    async getAllTickets(options) {
        return this.ticketController.getAllTickets(options);
    }
    async getTicketsByStatus(status) {
        const st = await this.statusService.getStatusByName(status);
        if (st instanceof models_1.LogError)
            return [];
        return this.ticketController.getTicketsByStatusId(st.statusId);
    }
    async getMaxTicketId() {
        return this.ticketController.getMaxTicketId();
    }
    getTicketById(ticketId) {
        return this.ticketController.getTicketById(ticketId);
    }
    async createTicket(options) {
        if (options.statusId !== null) {
            const status = await this.statusService.getStatusById(options.statusId);
            if (status instanceof models_1.LogError)
                return status;
        }
        if (options.priorityId !== null) {
            const priority = await this.priorityService.getPriorityById(options.priorityId);
            if (priority instanceof models_1.LogError)
                return priority;
        }
        return this.ticketController.createTicket(options);
    }
    async getMembersByTicketId(ticketId) {
        const ticket = await this.ticketController.getTicketById(ticketId);
        if (ticket instanceof models_1.LogError)
            return [];
        return await this.ticketController.getMembersByTicketId(ticketId);
    }
    async deleteTicketById(ticketId) {
        const ticket = await this.ticketController.getTicketById(ticketId);
        if (ticket instanceof models_1.LogError)
            return false;
        return await this.ticketController.deleteTicketsById(ticketId);
    }
    async updateTicket(options) {
        const ticket = await this.ticketController.getTicketById(options.ticketId);
        if (ticket instanceof models_1.LogError)
            return ticket;
        if (options.priorityId !== undefined) {
            const priority = await this.priorityService.getPriorityById(options.priorityId);
            if (priority instanceof models_1.LogError)
                return priority;
        }
        return await this.ticketController.updateTicket(options);
    }
    async searchTickets(search) {
        return await this.ticketController.searchTicket(search);
    }
    async openTicket(id) {
        const ticket = await this.ticketController.getTicketById(id);
        if (ticket instanceof models_1.LogError)
            return ticket;
        return await this.ticketController.openTicket(id);
    }
    async closeTicket(id) {
        const ticket = await this.ticketController.getTicketById(id);
        if (ticket instanceof models_1.LogError)
            return ticket;
        return await this.ticketController.closeTicket(id);
    }
    async archiveTicket(id) {
        const ticket = await this.ticketController.getTicketById(id);
        if (ticket instanceof models_1.LogError)
            return ticket;
        return await this.ticketController.archiveTicket(id);
    }
    async assignUserToTicket(ticketId, userMail) {
        const ticket = await this.ticketController.getTicketById(ticketId);
        if (ticket instanceof models_1.LogError)
            return ticket;
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        return this.ticketController.assignUserToTicket(ticketId, userMail);
    }
    async unassignUserToTicket(ticketId, userMail) {
        const ticket = await this.ticketController.getTicketById(ticketId);
        if (ticket instanceof models_1.LogError)
            return false;
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return false;
        return this.ticketController.unassignUserToTicket(ticketId, userMail);
    }
}
exports.TicketServiceImpl = TicketServiceImpl;
//# sourceMappingURL=ticket-service-impl.js.map