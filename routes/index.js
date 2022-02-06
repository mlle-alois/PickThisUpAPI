"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRoutes = void 0;
var auth_router_1 = require("./auth-router");
var board_router_1 = require("./board-router");
var list_router_1 = require("./list-router");
var task_router_1 = require("./task-router");
var ticket_router_1 = require("./ticket-router");
var user_router_1 = require("./user-router");
var event_router_1 = require("./event-router");
var status_router_1 = require("./status-router");
var zone_router_1 = require("./zone-router");
var carpool_router_1 = require("./carpool-router");
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
