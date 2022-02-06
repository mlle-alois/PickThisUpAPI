"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityServiceImpl = void 0;
const controllers_1 = require("../../controllers");
class PriorityServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.priorityController = new controllers_1.PriorityController(this.connection);
    }
    getPriorityById(priorityId) {
        return this.priorityController.getPriorityById(priorityId);
    }
}
exports.PriorityServiceImpl = PriorityServiceImpl;
//# sourceMappingURL=priority-service-impl.js.map