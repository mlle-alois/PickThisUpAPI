import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {DateUtils, getUserMailConnected, isDevConnected} from "../Utils";
import {TaskServiceImpl} from "../services/impl";
import {LogError} from "../models";

const taskRouter = express.Router();

/**
 * ajout d'une tache
 * URL : /task/add
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.post("/add", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

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
        if (positionInList instanceof LogError)
            return LogError.HandleStatus(res, positionInList);

        const creatorId = await getUserMailConnected(req);
        if (creatorId instanceof LogError)
            return LogError.HandleStatus(res, creatorId);

        const creationDate = DateUtils.getCurrentDate();

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
        })

        if (task instanceof LogError) {
            LogError.HandleStatus(res, task);
        } else {
            res.status(201);
            res.json(task);
        }
    }
    res.status(403).end();
});

/**
 * récupération de toutes les taches
 * URL : /task?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

        const tasks = await taskService.getAllTasks({
            limit,
            offset
        });
        res.json(tasks);
    }
    res.status(403).end();
});

/**
 * récupération d'une tache selon son id
 * URL : /task/get/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/get/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const task = await taskService.getTaskById(Number.parseInt(id));
        if (task instanceof LogError)
            LogError.HandleStatus(res, task);
        else
            res.json(task);
    }
    res.status(403).end();
});

/**
 * récupération des membres d'une tâche
 * URL : /task/getMembers/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/getMembers/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const members = await taskService.getMembersByTaskId(Number.parseInt(id));

        res.json(members);
    }
    res.status(403).end();
});

/**
 * récupération des développeurs assignables à une tâche
 * URL : /task/getAllDevelopers?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/getAllDevelopers", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

        const developers = await taskService.getAllDevelopers({
            limit,
            offset
        });
        res.json(developers);
    }
    res.status(403).end();
});

/**
 * modification d'une tache selon son id
 * URL : /task/update/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.put("/update/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
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
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const task = await taskService.updateTask({
            taskId: Number.parseInt(id),
            taskName: name,
            taskDescription: description,
            taskDeadline: deadline,
            statusId,
            priorityId,
            listId
        });

        if (task instanceof LogError)
            LogError.HandleStatus(res, task);
        else
            res.json(task);
    }
    res.status(403).end();
});

/**
 * modification de la position dans un tableau d'une tache selon son id
 * URL : /task/update-position/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.put("/update-position/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const id = req.params.id;
        const positionInList = req.body.position;

        if (id === undefined || positionInList === undefined) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const success = await taskService.updatePositionInListTask(Number.parseInt(id), positionInList);

        if (success)
            res.status(204).end();
        else
            res.status(404).end();
    }
    res.status(403).end();
});

/**
 * suppression d'une tache selon son id
 * URL : /task/delete/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.delete("/delete/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

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
});

/**
 * URL : /task/list/:id?limit={x}&offset={x}
 * Récupère toutes les tâches liés à une liste
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.get("/list/:id", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const id = req.params.id
        const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
        const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const task = await taskService.getAllTasksFromList(Number.parseInt(id),{limit,offset});
        if (task instanceof LogError)
            LogError.HandleStatus(res, task);
        else
            res.json(task);
    }
    res.status(403).end();
});

/**
 * assignation d'un développeur à une tâche
 * URL : /task/assign
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.post("/assign", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const taskId = req.body.taskId as string;
        const userMail = req.body.userMail as string;

        if (taskId === undefined || userMail === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const assignation = await taskService.assignUserToTask(Number.parseInt(taskId), userMail)

        if (assignation instanceof LogError) {
            LogError.HandleStatus(res, assignation);
        } else {
            res.status(201);
            res.json(assignation);
        }
    }
    res.status(403).end();
});

/**
 * désassignation d'un développeur à une tâche
 * URL : /task/unassign?taskId={x}&userMail={x}
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
taskRouter.delete("/unassign", authUserMiddleWare, async function (req, res) {
    //vérification droits d'accès
    console.log('oui')
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const taskService = new TaskServiceImpl(connection);

        const taskId = req.query.taskId as string;
        const userMail = req.query.userMail as string;

        if (taskId === undefined || userMail === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const success = await taskService.unassignUserToTask(Number.parseInt(taskId), userMail);
        if (success)
            res.status(204).end();
        else
            res.status(404).end();
    }
    res.status(403).end();
});

export {
    taskRouter
}