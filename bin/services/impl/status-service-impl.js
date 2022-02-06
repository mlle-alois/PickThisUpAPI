"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusServiceImpl = void 0;
const controllers_1 = require("../../controllers");
class StatusServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.statusController = new controllers_1.StatusController(this.connection);
    }
    getStatusById(statusId) {
        return this.statusController.getStatusById(statusId);
    }
    getStatusByName(statusName) {
        return this.statusController.getStatusByName(statusName);
    }
    getAllStatus(options) {
        return this.statusController.getAllStatus(options);
    }
}
exports.StatusServiceImpl = StatusServiceImpl;
//# sourceMappingURL=status-service-impl.js.map