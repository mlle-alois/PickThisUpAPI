import {Express} from "express";
import {authRouter} from "./auth-router";
import {boardRouter} from "./board-router";
import {listRouter} from "./list-router";
import {taskRouter} from "./task-router";
import {ticketRouter} from "./ticket-router";
import {userRouter} from "./user-router";
import {eventRouter} from "./event-router";
import {statusRouter} from "./status-router";
import {zoneRouter} from "./zone-router";
import {carpoolRouter} from "./carpool-router";


export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/board", boardRouter);
    app.use("/list", listRouter);
    app.use("/task", taskRouter);
    app.use("/ticket", ticketRouter);
    app.use("/user", userRouter);
    app.use("/event", eventRouter);
    app.use("/status", statusRouter);
    app.use("/zone", zoneRouter);
    app.use("/carpool", carpoolRouter);
}
