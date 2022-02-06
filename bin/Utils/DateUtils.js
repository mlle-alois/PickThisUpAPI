"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtils = void 0;
class DateUtils {
    static getCurrentTimeStamp() {
        return this.getCurrentDate().toISOString();
    }
    static getCurrentDate() {
        let date = new Date();
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    }
    static convertDateToISOString(date) {
        return ((date.toISOString().replace("T", " ")).split("."))[0];
    }
    static addXHoursToDate(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
    }
}
exports.DateUtils = DateUtils;
//# sourceMappingURL=DateUtils.js.map