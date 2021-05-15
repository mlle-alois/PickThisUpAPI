import {Express} from "express";
import {authRouter} from "./auth-router";
import {boardRouter} from "./board-router";
import {listRouter} from "./list-router";
import {taskRouter} from "./task-router";
import {ticketRouter} from "./ticket-router";
import {userRouter} from "./user-router";


export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/board", boardRouter);
    app.use("/list", listRouter);
    app.use("/task", taskRouter);
    app.use("/ticket", ticketRouter);
    app.use("/user", userRouter);
}
