import {Express} from "express";
import {authRouter} from "./auth-router";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
}
