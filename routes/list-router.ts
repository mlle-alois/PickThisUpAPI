import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {isDevConnected} from "../Utils";
import {ListServiceImpl} from "../services/impl";
import {LogError} from "../models";

const listRouter = express.Router();

/**
 * ajout d'une liste
 * URL : /list/add
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
listRouter.post("/add", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const listService = new ListServiceImpl(connection);

            const id = await listService.getMaxListId() + 1;
            const name = req.body.name;
            const boardId = req.body.boardId;

            if (name === undefined || boardId === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const positionInBoard = await listService.getMaxPositionInBoardById(boardId);
            if (positionInBoard instanceof LogError)
                return LogError.HandleStatus(res, positionInBoard);

            const list = await listService.createList({
                listId: id,
                listName: name,
                positionInBoard: positionInBoard + 1,
                boardId
            })

            if (list instanceof LogError) {
                LogError.HandleStatus(res, list);
            } else {
                res.status(201);
                res.json(list);
            }
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupération de tous les listes
 * URL : /list?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
listRouter.get("/", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const listService = new ListServiceImpl(connection);

            const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

            const listList = await listService.getAllLists({
                limit,
                offset
            });
            res.json(listList);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * récupération d'un liste selon son id
 * URL : /list/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
listRouter.get("/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const listService = new ListServiceImpl(connection);

            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const list = await listService.getListById(Number.parseInt(id));
            if (list instanceof LogError)
                LogError.HandleStatus(res, list);
            else
                res.json(list);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});


/**
 * récupération de toutes les listes lié à un board id
 * URL : /list/board/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
listRouter.get("/board/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const listService = new ListServiceImpl(connection);

            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const list = await listService.getListsByBoardId(Number.parseInt(id));
            if (list instanceof LogError)
                LogError.HandleStatus(res, list);
            else
                res.json(list);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});


/**
 * modification d'un liste selon son id
 * URL : /list/update/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
listRouter.put("/update/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const id = req.params.id;
            const name = req.body.name;
            const boardId = req.body.boardId;

            if (id === undefined || (name === undefined && boardId === undefined)) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await DatabaseUtils.getConnection();
            const listService = new ListServiceImpl(connection);

            const list = await listService.updateList({
                listId: Number.parseInt(id),
                listName: name,
                boardId
            });

            if (list instanceof LogError)
                LogError.HandleStatus(res, list);
            else
                res.json(list);
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * modification de la position dans un tableau d'une liste selon son id
 * URL : /list/update-position/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
listRouter.put("/update-position/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const id = req.params.id;
            const positionInBoard = req.body.position;

            if (id === undefined || positionInBoard === undefined) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await DatabaseUtils.getConnection();
            const listService = new ListServiceImpl(connection);

            const success = await listService.updatePositionInBoardList(Number.parseInt(id), positionInBoard);

            if (success)
                res.status(204).end();
            else
                res.status(404).end();
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

/**
 * suppression d'une liste selon son id
 * URL : /list/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
listRouter.delete("/:id", authUserMiddleWare, async function (req, res, next) {
    try {
        if (await isDevConnected(req)) {
            const connection = await DatabaseUtils.getConnection();
            const listService = new ListServiceImpl(connection);

            const id = req.params.id;

            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");

            const success = await listService.deleteListById(Number.parseInt(id));
            if (success)
                res.status(204).end();
            else
                res.status(404).end();
        }
        res.status(403).end();
    } catch (err) {
        next(err);
    }
});

export {
    listRouter
}