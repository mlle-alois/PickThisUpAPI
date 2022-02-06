"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRoutes = void 0;
const auth_router_1 = require("./auth-router");
const board_router_1 = require("./board-router");
const list_router_1 = require("./list-router");
const task_router_1 = require("./task-router");
const ticket_router_1 = require("./ticket-router");
const user_router_1 = require("./user-router");
const event_router_1 = require("./event-router");
const status_router_1 = require("./status-router");
const zone_router_1 = require("./zone-router");
const carpool_router_1 = require("./carpool-router");
function buildRoutes(app) {
    app.use("/auth", auth_router_1.authRouter);
    app.use("/board", board_router_1.boardRouter);
    app.use("/list", list_router_1.listRouter);
    app.use("/task", task_router_1.taskRouter);
    app.use("/ticket", ticket_router_1.ticketRouter);
    app.use("/user", user_router_1.userRouter);
    app.use("/event", event_router_1.eventRouter);
    app.use("/status", status_router_1.statusRouter);
    app.use("/zone", zone_router_1.zoneRouter);
    app.use("/carpool", carpool_router_1.carpoolRouter);
}
exports.buildRoutes = buildRoutes;
//# sourceMappingURL=index.js.map