import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {DateUtils, getUserMailConnected, isDevConnected} from "../Utils";
import {StatusServiceImpl, TicketServiceImpl} from "../services/impl";
import {LogError} from "../models";


const statusRouter = express.Router();

/**
 * récupération de tous les statuts
 * URL : /status?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
statusRouter.get("/", authUserMiddleWare, async function (req, res) {
    const connection = await DatabaseUtils.getConnection();
    const statusService = new StatusServiceImpl(connection);

    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

    const status = await statusService.getAllStatus({
        limit,
        offset
    });
    res.json(status);
});

export {
    statusRouter
}