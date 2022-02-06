"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollutionLevelController = void 0;
const models_1 = require("../models");
class PollutionLevelController {
    constructor(connection) {
        this.connection = connection;
    }
    async getPollutionLevelById(pollutionLevelId) {
        const res = await this.connection.query(`SELECT pollution_level_id,
                                                        pollution_level_libelle
                                                 FROM POLLUTION_LEVEL
                                                 where pollution_level_id = ?`, [
            pollutionLevelId
        ]);
        const data = res[0];
        if (Array.isArray(data)) {
            const rows = data;
            if (rows.length > 0) {
                const row = rows[0];
                return new models_1.PollutionLevelModel({
                    pollutionLevelId: row["pollution_level_id"],
                    pollutionLevelLibelle: row["pollution_level_libelle"]
                });
            }
        }
        return new models_1.LogError({ numError: 404, text: "User type not found" });
    }
}
exports.PollutionLevelController = PollutionLevelController;
//# sourceMappingURL=pollution-level-controller.js.map