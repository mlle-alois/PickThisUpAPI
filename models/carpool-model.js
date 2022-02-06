"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarpoolModel = void 0;
var CarpoolModel = /** @class */ (function () {
    function CarpoolModel(properties) {
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
    return CarpoolModel;
}());
exports.CarpoolModel = CarpoolModel;
