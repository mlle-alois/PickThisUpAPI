"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollutionLevelServiceImpl = void 0;
const controllers_1 = require("../../controllers");
class PollutionLevelServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.pollutionLevelController = new controllers_1.PollutionLevelController(this.connection);
    }
    getPollutionLevelById(pollutionLevelId) {
        return this.pollutionLevelController.getPollutionLevelById(pollutionLevelId);
    }
}
exports.PollutionLevelServiceImpl = PollutionLevelServiceImpl;
//# sourceMappingURL=pollution-level-service-impl.js.map