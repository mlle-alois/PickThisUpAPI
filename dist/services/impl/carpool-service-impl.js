"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarpoolServiceImpl = void 0;
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const user_service_impl_1 = require("./user-service-impl");
const event_service_impl_1 = require("./event-service-impl");
class CarpoolServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.carpoolController = new controllers_1.CarpoolController(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
        this.eventService = new event_service_impl_1.EventServiceImpl(this.connection);
    }
    async getMaxCarpoolId() {
        return this.carpoolController.getMaxCarpoolId();
    }
    getCarpoolById(carpoolId) {
        return this.carpoolController.getCarpoolById(carpoolId);
    }
    async createCarpool(options) {
        const event = await this.eventService.getEventById(options.eventId);
        if (event instanceof models_1.LogError)
            return event;
        const conductor = await this.userService.getUserByMail(options.conductorId);
        if (conductor instanceof models_1.LogError)
            return conductor;
        return this.carpoolController.createCarpool(options);
    }
    async deleteCarpoolById(carpoolId) {
        const carpool = await this.getCarpoolById(carpoolId);
        if (carpool instanceof models_1.LogError)
            return false;
        return this.carpoolController.deleteCarpoolsById(carpoolId);
    }
    async updateCarpool(options) {
        return await this.carpoolController.updateCarpool(options);
    }
    async registerCarpool(carpoolId, userMail) {
        const carpool = await this.getCarpoolById(carpoolId);
        if (carpool instanceof models_1.LogError)
            return carpool;
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        return await this.carpoolController.registerCarpool(carpoolId, userMail);
    }
    async unregisterCarpool(carpoolId, userMail) {
        const carpool = await this.getCarpoolById(carpoolId);
        if (carpool instanceof models_1.LogError)
            return carpool;
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        return await this.carpoolController.unregisterCarpool(carpoolId, userMail);
    }
    async getCarpoolsByEvent(eventId) {
        const event = await this.eventService.getEventById(eventId);
        if (event instanceof models_1.LogError)
            return event;
        return await this.carpoolController.getCarpoolsByEvent(eventId);
    }
    async getCarpoolMembersById(carpoolId) {
        const carpool = await this.getCarpoolById(carpoolId);
        if (carpool instanceof models_1.LogError)
            return carpool;
        return await this.carpoolController.getCarpoolMembersById(carpoolId);
    }
    async getOldAdressesCarpoolByUser(userMail) {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        return await this.carpoolController.getOldAdressesCarpoolByUser(userMail);
    }
}
exports.CarpoolServiceImpl = CarpoolServiceImpl;
//# sourceMappingURL=carpool-service-impl.js.map