"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneServiceImpl = void 0;
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const user_service_impl_1 = require("./user-service-impl");
const status_service_impl_1 = require("./status-service-impl");
const media_service_impl_1 = require("./media-service-impl");
const pollution_level_service_impl_1 = require("./pollution-level-service-impl");
class ZoneServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.zoneController = new controllers_1.ZoneController(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
        this.statusService = new status_service_impl_1.StatusServiceImpl(this.connection);
        this.mediaService = new media_service_impl_1.MediaServiceImpl(this.connection);
        this.pollutionLevelService = new pollution_level_service_impl_1.PollutionLevelServiceImpl(this.connection);
    }
    async getAllAvailableZones(userMail, options) {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        return this.zoneController.getAllAvailableZones(userMail, options);
    }
    async getMaxZoneId() {
        return this.zoneController.getMaxZoneId();
    }
    getZoneById(zoneId) {
        return this.zoneController.getZoneById(zoneId);
    }
    async createZone(options) {
        const signalman = await this.userService.getUserByMail(options.signalmanId);
        if (signalman instanceof models_1.LogError)
            return signalman;
        const status = await this.statusService.getStatusById(options.statusId);
        if (status instanceof models_1.LogError)
            return status;
        const pollutionLevel = await this.pollutionLevelService.getPollutionLevelById(options.pollutionLevelId);
        if (pollutionLevel instanceof models_1.LogError)
            return pollutionLevel;
        return this.zoneController.createZone(options);
    }
    async deleteZoneById(zoneId) {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof models_1.LogError)
            return false;
        return this.zoneController.deleteZonesById(zoneId);
    }
    async updateZone(options) {
        const pollutionLevel = await this.pollutionLevelService.getPollutionLevelById(options.pollutionLevelId);
        if (pollutionLevel instanceof models_1.LogError)
            return pollutionLevel;
        return await this.zoneController.updateZone(options);
    }
    async getZonesByUser(userMail) {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        return await this.zoneController.getZonesByUser(userMail);
    }
    async getValidatedZones() {
        return await this.zoneController.getValidatedZones();
    }
    async getWaitingZones() {
        return await this.zoneController.getWaitingZones();
    }
    async getRefusedZones() {
        return await this.zoneController.getRefusedZones();
    }
    async getZonesByUserAndStatus(userMail, statusId) {
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        const status = await this.statusService.getStatusById(statusId);
        if (status instanceof models_1.LogError)
            return status;
        return await this.zoneController.getZonesByUserAndStatus(userMail, statusId);
    }
    async acceptZone(zoneId) {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof models_1.LogError)
            return zone;
        return await this.zoneController.acceptZone(zoneId);
    }
    async refuseZone(zoneId) {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof models_1.LogError)
            return zone;
        return await this.zoneController.refuseZone(zoneId);
    }
    async addMediaToZone(options, zoneId) {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof models_1.LogError)
            return zone;
        const media = await this.mediaService.createMedia(options);
        if (media instanceof models_1.LogError)
            return media;
        return this.zoneController.addMediaToZone(media.mediaId, zoneId);
    }
    async removeMediaToZone(mediaId, zoneId) {
        const media = await this.mediaService.getMediaById(mediaId);
        if (media instanceof models_1.LogError)
            return false;
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof models_1.LogError)
            return false;
        const success = this.zoneController.removeMediaToZone(mediaId, zoneId);
        if (!success)
            return false;
        return this.mediaService.deleteMedia(mediaId);
    }
    async getMediaZonesById(zoneId) {
        const zone = await this.getZoneById(zoneId);
        if (zone instanceof models_1.LogError)
            return zone;
        return this.zoneController.getMediaZonesById(zoneId);
    }
}
exports.ZoneServiceImpl = ZoneServiceImpl;
//# sourceMappingURL=zone-service-impl.js.map