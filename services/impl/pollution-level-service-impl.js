"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollutionLevelServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var PollutionLevelServiceImpl = /** @class */ (function () {
    function PollutionLevelServiceImpl(connection) {
        this.connection = connection;
        this.pollutionLevelController = new controllers_1.PollutionLevelController(this.connection);
    }
    /**
     * Récupération d'un pollutionLevel depuis son :
     * @param pollutionLevelId
     */
    PollutionLevelServiceImpl.prototype.getPollutionLevelById = function (pollutionLevelId) {
        return this.pollutionLevelController.getPollutionLevelById(pollutionLevelId);
    };
    return PollutionLevelServiceImpl;
}());
exports.PollutionLevelServiceImpl = PollutionLevelServiceImpl;
