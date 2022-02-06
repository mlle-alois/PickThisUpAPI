"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarpoolModel = void 0;
class CarpoolModel {
    constructor(properties) {
        this.carpoolId = properties.carpoolId;
        this.carpoolDepartureStreet = properties.carpoolDepartureStreet;
        this.carpoolDepartureZipcode = properties.carpoolDepartureZipcode;
        this.carpoolDepartureCity = properties.carpoolDepartureCity;
        this.nbPlaces = properties.nbPlaces;
        this.carpoolRemainingPlaces = properties.carpoolRemainingPlaces;
        this.eventId = properties.eventId;
        this.conductorId = properties.conductorId;
        this.conductor = properties.conductor;
    }
}
exports.CarpoolModel = CarpoolModel;
//# sourceMappingURL=carpool-model.js.map