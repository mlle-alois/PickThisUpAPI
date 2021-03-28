import {Express} from "express";
import {userRouter} from "./user-routes";

export function buildRoutes(app: Express) {
    app.use("/pickthisup", userRouter);
}
