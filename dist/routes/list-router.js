"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const Utils_1 = require("../Utils");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const listRouter = express_1.default.Router();
exports.listRouter = listRouter;
listRouter.post("/add", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const listService = new impl_1.ListServiceImpl(connection);
            const id = await listService.getMaxListId() + 1;
            const name = req.body.name;
            const boardId = req.body.boardId;
            if (name === undefined || boardId === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const positionInBoard = await listService.getMaxPositionInBoardById(boardId);
            if (positionInBoard instanceof models_1.LogError)
                return models_1.LogError.HandleStatus(res, positionInBoard);
            const list = await listService.createList({
                listId: id,
                listName: name,
                positionInBoard: positionInBoard + 1,
                boardId
            });
            if (list instanceof models_1.LogError) {
                models_1.LogError.HandleStatus(res, list);
            }
            else {
                res.status(201);
                res.json(list);
            }
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
listRouter.get("/", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const listService = new impl_1.ListServiceImpl(connection);
            const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
            const listList = await listService.getAllLists({
                limit,
                offset
            });
            res.json(listList);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
listRouter.get("/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const listService = new impl_1.ListServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const list = await listService.getListById(Number.parseInt(id));
            if (list instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, list);
            else
                res.json(list);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
listRouter.get("/board/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const listService = new impl_1.ListServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const list = await listService.getListsByBoardId(Number.parseInt(id));
            if (list instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, list);
            else
                res.json(list);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
listRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            const name = req.body.name;
            const boardId = req.body.boardId;
            if (id === undefined || (name === undefined && boardId === undefined)) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await database_1.DatabaseUtils.getConnection();
            const listService = new impl_1.ListServiceImpl(connection);
            const list = await listService.updateList({
                listId: Number.parseInt(id),
                listName: name,
                boardId
            });
            if (list instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, list);
            else
                res.json(list);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
listRouter.put("/update-position/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            const positionInBoard = req.body.position;
            if (id === undefined || positionInBoard === undefined) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await database_1.DatabaseUtils.getConnection();
            const listService = new impl_1.ListServiceImpl(connection);
            const success = await listService.updatePositionInBoardList(Number.parseInt(id), positionInBoard);
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
listRouter.delete("/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const listService = new impl_1.ListServiceImpl(connection);
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
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=list-router.js.map