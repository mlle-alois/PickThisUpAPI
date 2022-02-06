"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const impl_1 = require("../services/impl");
const statusRouter = express_1.default.Router();
exports.statusRouter = statusRouter;
statusRouter.get("/", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        const connection = await database_1.DatabaseUtils.getConnection();
        const statusService = new impl_1.StatusServiceImpl(connection);
        const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
        const status = await statusService.getAllStatus({
            limit,
            offset
        });
        res.json(status);
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=status-router.js.map