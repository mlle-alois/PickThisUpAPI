"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const Utils_1 = require("../Utils");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const boardRouter = express_1.default.Router();
exports.boardRouter = boardRouter;
boardRouter.post("/add", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const boardService = new impl_1.BoardServiceImpl(connection);
            const id = await boardService.getMaxBoardId() + 1;
            const name = req.body.name;
            if (name === undefined) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const board = await boardService.createBoard({
                boardId: id,
                boardName: name
            });
            if (board instanceof models_1.LogError) {
                models_1.LogError.HandleStatus(res, board);
            }
            else {
                res.status(201);
                res.json(board);
            }
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
boardRouter.get("/", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const boardService = new impl_1.BoardServiceImpl(connection);
            const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
            const boardList = await boardService.getAllBoards({
                limit,
                offset
            });
            res.json(boardList);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
boardRouter.get("/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const boardService = new impl_1.BoardServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const board = await boardService.getBoardById(Number.parseInt(id));
            if (board instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, board);
            else
                res.json(board);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
boardRouter.put("/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            const name = req.body.name;
            if (id === undefined || name === undefined) {
                res.status(400).end();
                return;
            }
            const connection = await database_1.DatabaseUtils.getConnection();
            const boardService = new impl_1.BoardServiceImpl(connection);
            const board = await boardService.updateBoard({
                boardId: Number.parseInt(id),
                boardName: name,
            });
            if (board instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, board);
            else
                res.json(board);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
boardRouter.delete("/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const boardService = new impl_1.BoardServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const success = await boardService.deleteBoardsById(Number.parseInt(id));
            if (success)
                res.status(204).end();
            else
                res.status(404).end();
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=board-router.js.map