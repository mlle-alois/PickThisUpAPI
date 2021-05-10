import {TaskController, TaskGetAllOptions, TaskUpdateOptions} from "../../controllers";
import {LogError, TaskModel} from "../../models";
import {Connection} from "mysql2/promise";
import {TaskService} from "../task-service";
import {ListServiceImpl} from "./list-service-impl";
import {UserServiceImpl} from "./user-service-impl";
import {StatusServiceImpl} from "./status-service-impl";
import {PriorityServiceImpl} from "./priority-service-impl";

export class TaskServiceImpl implements TaskService {

    private connection: Connection;
    private taskController: TaskController;
    private listService: ListServiceImpl;
    private statusService: StatusServiceImpl;
    private priorityService: PriorityServiceImpl;
    private userService: UserServiceImpl;

    constructor(connection: Connection) {
        this.connection = connection;
        this.taskController = new TaskController(this.connection);
        this.listService = new ListServiceImpl(this.connection);
        this.statusService = new StatusServiceImpl(this.connection);
        this.priorityService = new PriorityServiceImpl(this.connection);
        this.userService = new UserServiceImpl(this.connection);
    }

    /**
     * Récupération de toutes les tasks
     * @param options -> Limit et offset de la requete
     */
    async getAllTasks(options?: TaskGetAllOptions): Promise<TaskModel[]> {
        return this.taskController.getAllTasks(options);
    }

    /**
     * Récupération de l'id de task maximum existant
     */
    async getMaxTaskId(): Promise<number> {
        return this.taskController.getMaxTaskId();
    }

    /**
     * Récupération d'une task depuis son :
     * @param taskId
     */
    getTaskById(taskId: number): Promise<TaskModel | LogError> {
        return this.taskController.getTaskById(taskId);
    }

    /**
     * Création d'une task
     * @param options
     */
    async createTask(options: TaskModel): Promise<TaskModel | LogError> {
        if(options.statusId !== null) {
            const status = await this.statusService.getStatusById(options.statusId as number);
            if (status instanceof LogError)
                return new LogError({numError: 404, text: "Status not exists"});
        }
        if(options.priorityId !== null) {
            const priority = await this.priorityService.getPriorityById(options.priorityId as number);
            if (priority instanceof LogError)
                return new LogError({numError: 404, text: "Priority not exists"});
        }
        const list = await this.listService.getListById(options.listId);
        if (list instanceof LogError)
            return new LogError({numError: 404, text: "List not exists"});

        const creator = await this.userService.getUserByMail(options.creatorId);
        if (creator instanceof LogError)
            return new LogError({numError: 404, text: "Creator not exists"});

        return this.taskController.createTask(options);
    }

    /**
     * suppression d'une task selon son id
     * @param taskId
     */
    async deleteTaskById(taskId: number): Promise<boolean> {
        const task = await this.taskController.getTaskById(taskId);
        if (task instanceof LogError)
            return false;

        if (!await this.taskController.deleteTasksById(taskId))
            return false;

        return await this.reorderPositionsInListAfterDeleted(task.listId, task.positionInList);
    }

    /**
     * Modification des informations d'une task renseignées dans les options
     * En cas de modification de liste, la position dans la liste est modifiée à la plus élevée existante
     * @param options
     */
    async updateTask(options: TaskUpdateOptions): Promise<TaskModel | LogError> {
        const task = await this.taskController.getTaskById(options.taskId);
        if (task instanceof LogError)
            return new LogError({numError: 404, text: "Task not exists"});

        if(options.statusId !== undefined) {
            const status = await this.statusService.getStatusById(options.statusId as number);
            if (status instanceof LogError)
                return new LogError({numError: 404, text: "Status not exists"});
        }
        if(options.priorityId !== undefined) {
            const priority = await this.priorityService.getPriorityById(options.priorityId as number);
            if (priority instanceof LogError)
                return new LogError({numError: 404, text: "Priority not exists"});
        }
        if (options.listId !== undefined) {
            const list = await this.listService.getListById(options.listId);
            if (list instanceof LogError)
                return new LogError({numError: 404, text: "List not exists"});

            const positionInList = await this.getMaxPositionInListById(options.listId);
            if (positionInList instanceof LogError)
                return positionInList;

            options.positionInList = positionInList + 1;
        }

        const update = await this.taskController.updateTask(options);

        if (options.listId !== undefined)
            await this.reorderPositionsInListAfterDeleted(task.listId, task.positionInList as number);

        return update;
    }

    /**
     * Modification de la position dans une liste d'une task selon son id
     * @param taskId
     * @param newPositionInList
     */
    async updatePositionInListTask(taskId: number, newPositionInList: number): Promise<boolean> {
        const task = await this.taskController.getTaskById(taskId);
        if (task instanceof LogError)
            return false;

        if (task.positionInList === newPositionInList)
            return true;

        return task.positionInList < newPositionInList ? await this.taskController.updatePositionInListTaskMinus(taskId, newPositionInList)
            : await this.taskController.updatePositionInListTaskPlus(taskId, newPositionInList);
    }

    /**
     * récupération de la position maximale dans un tableau depuis son
     * @param listId
     */
    async getMaxPositionInListById(listId: number): Promise<number | LogError> {
        const list = await this.listService.getListById(listId);
        if (list instanceof LogError)
            return new LogError({numError: 404, text: "List not exists"});

        return await this.taskController.getMaxPositionInListById(listId);
    }

    /**
     * Ordonner les positions dans le tableau après suppression
     * @param listId
     * @param positionDeleted
     */
    async reorderPositionsInListAfterDeleted(listId: number, positionDeleted: number): Promise<boolean> {
        const list = await this.listService.getListById(listId);
        if (list instanceof LogError)
            return false;

        const listTasks =  await this.getAllTasksFromList(list.listId);
        if(listTasks instanceof LogError)
            return false;
        if(listTasks.length > 0 && (listTasks.length === 1 && listTasks[0].positionInList !== 1)) {
            if (positionDeleted !== 0) {
                return await this.taskController.reorderPositionsInListAfterDeleted(listId, positionDeleted);
            }
        }
        return true;
    }

    /**
     * Récupère toutes les tâches liés à une liste
     * @param listId
     * @param options
     */
    async getAllTasksFromList(listId: number,options?: TaskGetAllOptions): Promise<TaskModel[] | LogError> {
        return this.taskController.getAllTasksFromList(listId,options);
    }

}