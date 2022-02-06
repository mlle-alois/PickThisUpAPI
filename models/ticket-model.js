"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModel = void 0;
var TicketModel = /** @class */ (function () {
    function TicketModel(properties) {
        this.ticketId = properties.ticketId;
        this.ticketName = properties.ticketName;
        this.ticketDescription = properties.ticketDescription;
        this.ticketCreationDate = properties.ticketCreationDate;
        this.ticketClosingDate = properties.ticketClosingDate;
        this.statusId = properties.statusId;
        this.priorityId = properties.priorityId;
        this.creatorId = properties.creatorId;
        this.statusLibelle = properties.statusLibelle;
    }
    return TicketModel;
}());
exports.TicketModel = TicketModel;
