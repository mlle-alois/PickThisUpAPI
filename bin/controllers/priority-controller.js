"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityController = void 0;
const models_1 = require("../models");
class PriorityController {
    constructor(connection) {
        this.connection = connection;
    }
    async getPriorityById(priorityId) {
        const res = await this.connection.query(`SELECT priority_id, priority_libelle
                                                 FROM PRIORITY
                                                 where priority_id = ?`, [
            priorityId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.PriorityModel({
                    priorityId: row["priority_id"],
                    priorityLibelle: row["priority_libelle"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "Priority not found" });
    }
}
exports.PriorityController = PriorityController;
//# sourceMappingURL=priority-controller.js.map