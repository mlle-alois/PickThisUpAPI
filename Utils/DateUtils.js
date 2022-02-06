"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
var DateUtils = /** @class */ (function () {
    function DateUtils() {
    }
    DateUtils.getCurrentTimeStamp = function () {
        return this.getCurrentDate().toISOString();
    };
    DateUtils.getCurrentDate = function () {
        var date = new Date();
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    };
    DateUtils.convertDateToISOString = function (date) {
        return ((date.toISOString().replace("T", " ")).split("."))[0];
    };
    /**
     * Ajoute x heures à la date entrée en paramètre
     * @param date
     * @param hours
     */
    DateUtils.addXHoursToDate = function (date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
    };
    return DateUtils;
}());
exports.DateUtils = DateUtils;
