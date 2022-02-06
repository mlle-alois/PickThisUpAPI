"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusController = void 0;
const models_1 = require("../models");
class StatusController {
    constructor(connection) {
        this.connection = connection;
    }
    async getStatusById(statusId) {
        const res = await this.connection.query(`SELECT status_id, status_libelle
                                                 FROM STATUS
                                                 where status_id = ?`, [
            statusId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.StatusModel({
                    statusId: row["status_id"],
                    statusLibelle: row["status_libelle"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "Status not found" });
    }
    async getStatusByName(statusName) {
        const res = await this.connection.query(`SELECT status_id, status_libelle
                                                 FROM STATUS
                                                 where status_libelle = ?`, [
            statusName
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.StatusModel({
                    statusId: row["status_id"],
                    statusLibelle: row["status_libelle"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "Status not found" });
    }
    async getAllStatus(options) {
        const limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
        const offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
        const res = await this.connection.query(`SELECT status_id,
                                                        status_libelle
                                                 FROM STATUS LIMIT ?, ?`, [
            offset, limit
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            return data.map(function (row) {
                return new models_1.StatusModel({
                    statusId: row["status_id"],
                    statusLibelle: row["status_libelle"]
                });
            });
        }
        return [];
    }
}
exports.StatusController = StatusController;
//# sourceMappingURL=status-controller.js.map