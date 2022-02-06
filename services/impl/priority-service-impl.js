"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var PriorityServiceImpl = /** @class */ (function () {
    function PriorityServiceImpl(connection) {
        this.connection = connection;
        this.priorityController = new controllers_1.PriorityController(this.connection);
    }
    /**
     * Récupération d'une priority depuis son :
     * @param priorityId
     */
    PriorityServiceImpl.prototype.getPriorityById = function (priorityId) {
        return this.priorityController.getPriorityById(priorityId);
    };
    return PriorityServiceImpl;
}());
exports.PriorityServiceImpl = PriorityServiceImpl;
