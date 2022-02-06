"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
var EventModel = /** @class */ (function () {
    function EventModel(properties) {
        this.eventId = properties.eventId;
        this.eventTitle = properties.eventTitle;
        this.eventDescription = properties.eventDescription;
        this.dateHourStart = properties.dateHourStart;
        this.dateHourEnd = properties.dateHourEnd;
        this.dateHourCreation = properties.dateHourCreation;
        this.eventMaxNbPlaces = properties.eventMaxNbPlaces;
        this.eventRemainingPlaces = properties.eventRemainingPlaces;
        this.eventPitureId = properties.eventPitureId;
        this.picture = properties.picture;
        this.statusId = properties.statusId;
        this.creatorId = properties.creatorId;
        this.zoneId = properties.zoneId;
        this.zone = properties.zone;
    }
    return EventModel;
}());
exports.EventModel = EventModel;
