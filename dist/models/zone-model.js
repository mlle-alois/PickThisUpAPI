"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneModel = void 0;
class ZoneModel {
    constructor(properties) {
        this.zoneId = properties.zoneId;
        this.zoneStreet = properties.zoneStreet;
        this.zoneZipcode = properties.zoneZipcode;
        this.zoneCity = properties.zoneCity;
        this.zoneDescription = properties.zoneDescription;
        this.signalmanId = properties.signalmanId;
        this.statusId = properties.statusId;
        this.pollutionLevelId = properties.pollutionLevelId;
        this.pollutionLevel = properties.pollutionLevel;
    }
}
exports.ZoneModel = ZoneModel;
//# sourceMappingURL=zone-model.js.map