"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var StatusServiceImpl = /** @class */ (function () {
    function StatusServiceImpl(connection) {
        this.connection = connection;
        this.statusController = new controllers_1.StatusController(this.connection);
    }
    /**
     * Récupération d'un status depuis son :
     * @param statusId
     */
    StatusServiceImpl.prototype.getStatusById = function (statusId) {
        return this.statusController.getStatusById(statusId);
    };
    /**
     * Récupération d'un status depuis son :
     * @param statusName
     */
    StatusServiceImpl.prototype.getStatusByName = function (statusName) {
        return this.statusController.getStatusByName(statusName);
    };
    /**
     * Récupération de tous les status possibles des tickets
     * @param options
     */
    StatusServiceImpl.prototype.getAllStatus = function (options) {
        return this.statusController.getAllStatus(options);
    };
    return StatusServiceImpl;
}());
exports.StatusServiceImpl = StatusServiceImpl;
