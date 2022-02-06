"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventServiceImpl = void 0;
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const user_service_impl_1 = require("./user-service-impl");
const status_service_impl_1 = require("./status-service-impl");
const media_service_impl_1 = require("./media-service-impl");
const zone_service_impl_1 = require("./zone-service-impl");
class EventServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.eventController = new controllers_1.EventController(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
        this.statusService = new status_service_impl_1.StatusServiceImpl(this.connection);
        this.mediaServcice = new media_service_impl_1.MediaServiceImpl(this.connection);
        this.zoneService = new zone_service_impl_1.ZoneServiceImpl(this.connection);
    }
    async getAllValidatedEvents(options) {
        return this.eventController.getAllValidatedEvents(options);
    }
    async getMaxEventId() {
        return this.eventController.getMaxEventId();
    }
    getEventById(eventId) {
        return this.eventController.getEventById(eventId);
    }
    async createEvent(options) {
        const status = await this.statusService.getStatusById(options.statusId);
        if (status instanceof models_1.LogError)
            return status;
        const picture = await this.mediaServcice.getMediaById(options.eventPitureId);
        if (picture instanceof models_1.LogError)
            return picture;
        const creator = await this.userService.getUserByMail(options.creatorId);
        if (creator instanceof models_1.LogError)
            return creator;
        const zone = await this.zoneService.getZoneById(options.zoneId);
        if (zone instanceof models_1.LogError)
            return zone;
        return this.eventController.createEvent(options);
    }
    async deleteEventsById(eventId) {
        const event = await this.getEventById(eventId);
        if (event instanceof models_1.LogError)
            return false;
        return this.eventController.deleteEventsById(eventId);
    }
    async updateEvent(options) {
        if (options.eventPitureId !== undefined) {
            const picture = await this.mediaServcice.getMediaById(options.eventPitureId);
            if (picture instanceof models_1.LogError)
                return picture;
        }
        return await this.eventController.updateEvent(options);
    }
    async registerEvent(eventId, userMail) {
        const event = await this.getEventById(eventId);
        if (event instanceof models_1.LogError)
            return event;
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        return await this.eventController.registerEvent(eventId, userMail);
    }
    async unregisterEvent(eventId, userMail) {
        const event = await this.getEventById(eventId);
        if (event instanceof models_1.LogError)
            return event;
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        const participants = await this.eventController.unregisterEvent(eventId, userMail);
        if (participants instanceof models_1.LogError)
            return participants;
        const success = await this.eventController.deleteEventCarpoolsOfUser(eventId, userMail);
        if (success instanceof models_1.LogError)
            return success;
        return participants;
    }
    async getPastEventsByUser(userMail) {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return new models_1.LogError({ numError: 404, text: "User don't exists" });
        return await this.eventController.getPastEventsByUser(userMail);
    }
    async getFutureEventsByUser(userMail) {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return new models_1.LogError({ numError: 404, text: "User don't exists" });
        return await this.eventController.getFutureEventsByUser(userMail);
    }
    async getActualEventsByUser(userMail) {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return new models_1.LogError({ numError: 404, text: "User don't exists" });
        return await this.eventController.getActualEventsByUser(userMail);
    }
    async getValidatedEvents() {
        return await this.eventController.getValidatedEvents();
    }
    async getWaitingEvents() {
        return await this.eventController.getWaitingEvents();
    }
    async getRefusedEvents() {
        return await this.eventController.getRefusedEvents();
    }
    async acceptEvent(eventId) {
        const event = await this.getEventById(eventId);
        if (event instanceof models_1.LogError)
            return new models_1.LogError({ numError: 404, text: "Event don't exists" });
        return await this.eventController.acceptEvent(eventId);
    }
    async refuseEvent(eventId) {
        const event = await this.getEventById(eventId);
        if (event instanceof models_1.LogError)
            return new models_1.LogError({ numError: 404, text: "Event don't exists" });
        return await this.eventController.refuseEvent(eventId);
    }
    async getParticipantsEvent(eventId) {
        const event = await this.getEventById(eventId);
        if (event instanceof models_1.LogError)
            return new models_1.LogError({ numError: 404, text: "Event don't exists" });
        return await this.eventController.getParticipantsEvent(eventId);
    }
}
exports.EventServiceImpl = EventServiceImpl;
//# sourceMappingURL=event-service-impl.js.map