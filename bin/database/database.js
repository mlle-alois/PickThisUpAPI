"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUtils = void 0;
const promise_1 = require("mysql2/promise");
class DatabaseUtils {
    static async getConnection() {
        if (!DatabaseUtils.connection) {
            DatabaseUtils.connection = await (0, promise_1.createConnection)({
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: Number.parseInt(process.env.DB_PORT)
            });
        }
        return DatabaseUtils.connection;
    }
}
exports.DatabaseUtils = DatabaseUtils;
//# sourceMappingURL=database.js.map