import {Express} from "express";
import {authRouter} from "./auth-router";
import {boardRouter} from "./board-router";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/board", boardRouter);
}
