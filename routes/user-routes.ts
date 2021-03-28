import express from "express";
import {DatabaseUtils} from "../database";

const userRouter = express.Router();

userRouter.get("/", async function (req, res) {
    const connection = await DatabaseUtils.getConnexion();
    console.log(connection);
    res.json(connection);
});

export {
    userRouter
};
