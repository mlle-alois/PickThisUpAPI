import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {isDevConnected} from "../Utils";
import {BoardServiceImpl} from "../services/impl";
import {LogError} from "../models";

const boardRouter = express.Router();

/**
 * ajout d'un tableau
 * URL : /board/add
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.post("/add", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const boardService = new BoardServiceImpl(connection);

        const id = await boardService.getMaxBoardId() + 1;
        const name = req.body.name;

        if (name === undefined) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }

        const board = await boardService.createBoard({
            boardId: id,
            boardName: name
        })

        if (board instanceof LogError) {
            LogError.HandleStatus(res, board);
        } else {
            res.status(201);
            res.json(board);
        }
    }
    res.status(403).end();
});

/**
 * récupération de tous les tableaux
 * URL : /board?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.get("/", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const boardService = new BoardServiceImpl(connection);

        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

        const boardList = await boardService.getAllBoards({
            limit,
            offset
        });
        res.json(boardList);
    }
    res.status(403).end();
});

/**
 * récupération d'un tableau selon son id
 * URL : /board/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.get("/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const boardService = new BoardServiceImpl(connection);

        const id = req.params.id;

        if(id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const board = await boardService.getBoardById(Number.parseInt(id));
        if (board instanceof LogError)
            LogError.HandleStatus(res, board);
        else
            res.json(board);
    }
    res.status(403).end();
});

/**
 * modification d'un tableau selon son id
 * URL : /board/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.put("/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const id = req.params.id;
        const name = req.body.name;

        //invalide s'il n'y a pas d'id ou qu'aucune option à modifier n'est renseignée
        if (id === undefined || name === undefined) {
            res.status(400).end();
            return;
        }
        const connection = await DatabaseUtils.getConnection();
        const boardService = new BoardServiceImpl(connection);

        const board = await boardService.updateBoard({
            boardId: Number.parseInt(id),
            boardName: name,
        });

        if (board instanceof LogError)
            LogError.HandleStatus(res, board);
        else
            res.json(board);
    }
    res.status(403).end();
});

/**
 * suppression d'un tableau selon son id
 * URL : /board/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.delete("/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const boardService = new BoardServiceImpl(connection);

        const id = req.params.id;

        if(id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const success = await boardService.deleteBoardsById(Number.parseInt(id));
        if (success)
            res.status(204).end();
        else
            res.status(404).end();
    }
    res.status(403).end();
});

export {
    boardRouter
}