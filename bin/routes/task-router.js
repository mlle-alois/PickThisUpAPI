"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database/database");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const Utils_1 = require("../Utils");
const impl_1 = require("../services/impl");
const models_1 = require("../models");
const taskRouter = express_1.default.Router();
exports.taskRouter = taskRouter;
taskRouter.post("/add", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const id = await taskService.getMaxTaskId() + 1;
            const name = req.body.name;
            const description = req.body.description ? req.body.description : null;
            const deadline = req.body.deadline ? req.body.deadline : null;
            const priorityId = req.body.priorityId ? req.body.priorityId : null;
            const listId = req.body.listId;
            if (name === undefined || description === undefined || listId === undefined ||
                deadline === undefined || priorityId === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const positionInList = await taskService.getMaxPositionInListById(listId);
            if (positionInList instanceof models_1.LogError)
                return models_1.LogError.HandleStatus(res, positionInList);
            const creatorId = await (0, Utils_1.getUserMailConnected)(req);
            if (creatorId instanceof models_1.LogError)
                return models_1.LogError.HandleStatus(res, creatorId);
            const creationDate = Utils_1.DateUtils.getCurrentDate();
            const task = await taskService.createTask({
                taskId: id,
                taskName: name,
                taskDescription: description,
                taskCreationDate: creationDate,
                taskDeadline: deadline,
                positionInList: positionInList + 1,
                priorityId,
                listId,
                creatorId
            });
            if (task instanceof models_1.LogError) {
                models_1.LogError.HandleStatus(res, task);
            }
            else {
                res.status(201);
                res.json(task);
            }
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
taskRouter.get("/", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
            const tasks = await taskService.getAllTasks({
                limit,
                offset
            });
            res.json(tasks);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
taskRouter.get("/get/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const task = await taskService.getTaskById(Number.parseInt(id));
            if (task instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, task);
            else
                res.json(task);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
taskRouter.get("/getMembers/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const members = await taskService.getMembersByTaskId(Number.parseInt(id));
            res.json(members);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
taskRouter.put("/update/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            const name = req.body.name;
            const description = req.body.description;
            const deadline = req.body.deadline;
            const statusId = req.body.statusId;
            const priorityId = req.body.priorityId;
            const listId = req.body.listId;
            if (id === undefined || (name === undefined && description === undefined &&
                listId === undefined && deadline === undefined && statusId === undefined &&
                priorityId === undefined)) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const task = await taskService.updateTask({
                taskId: Number.parseInt(id),
                taskName: name,
                taskDescription: description,
                taskDeadline: deadline,
                statusId,
                priorityId,
                listId
            });
            if (task instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, task);
            else
                res.json(task);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
taskRouter.put("/update-position/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const id = req.params.id;
            const positionInList = req.body.position;
            if (id === undefined || positionInList === undefined) {
                res.status(400).end("Veuillez renseigner les informations nécessaires");
                return;
            }
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const success = await taskService.updatePositionInListTask(Number.parseInt(id), positionInList);
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
taskRouter.delete("/delete/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const id = req.params.id;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const success = await taskService.deleteTaskById(Number.parseInt(id));
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
taskRouter.get("/list/:id", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const id = req.params.id;
            const limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
            const offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
            if (id === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const task = await taskService.getAllTasksFromList(Number.parseInt(id), { limit, offset });
            if (task instanceof models_1.LogError)
                models_1.LogError.HandleStatus(res, task);
            else
                res.json(task);
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
taskRouter.post("/assign", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const taskId = req.body.taskId;
            const userMail = req.body.userMail;
            if (taskId === undefined || userMail === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const assignation = await taskService.assignUserToTask(Number.parseInt(taskId), userMail);
            if (assignation instanceof models_1.LogError) {
                models_1.LogError.HandleStatus(res, assignation);
            }
            else {
                res.status(201);
                res.json(assignation);
            }
        }
        res.status(403).end();
    }
    catch (err) {
        next(err);
    }
});
taskRouter.delete("/unassign", auth_middleware_1.authUserMiddleWare, async function (req, res, next) {
    try {
        if (await (0, Utils_1.isDevConnected)(req)) {
            const connection = await database_1.DatabaseUtils.getConnection();
            const taskService = new impl_1.TaskServiceImpl(connection);
            const taskId = req.query.taskId;
            const userMail = req.query.userMail;
            if (taskId === undefined || userMail === undefined)
                return res.status(400).end("Veuillez renseigner les informations nécessaires");
            const success = await taskService.unassignUserToTask(Number.parseInt(taskId), userMail);
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
//# sourceMappingURL=task-router.js.map