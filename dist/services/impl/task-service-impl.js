"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskServiceImpl = void 0;
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const list_service_impl_1 = require("./list-service-impl");
const user_service_impl_1 = require("./user-service-impl");
const status_service_impl_1 = require("./status-service-impl");
const priority_service_impl_1 = require("./priority-service-impl");
class TaskServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.taskController = new controllers_1.TaskController(this.connection);
        this.listService = new list_service_impl_1.ListServiceImpl(this.connection);
        this.statusService = new status_service_impl_1.StatusServiceImpl(this.connection);
        this.priorityService = new priority_service_impl_1.PriorityServiceImpl(this.connection);
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
    }
    async getAllTasks(options) {
        return this.taskController.getAllTasks(options);
    }
    async getMaxTaskId() {
        return this.taskController.getMaxTaskId();
    }
    getTaskById(taskId) {
        return this.taskController.getTaskById(taskId);
    }
    async createTask(options) {
        if (options.priorityId !== null) {
            const priority = await this.priorityService.getPriorityById(options.priorityId);
            if (priority instanceof models_1.LogError)
                return priority;
        }
        const list = await this.listService.getListById(options.listId);
        if (list instanceof models_1.LogError)
            return list;
        const creator = await this.userService.getUserByMail(options.creatorId);
        if (creator instanceof models_1.LogError)
            return creator;
        return this.taskController.createTask(options);
    }
    async getMembersByTaskId(taskId) {
        const task = await this.taskController.getTaskById(taskId);
        if (task instanceof models_1.LogError)
            return [];
        return await this.taskController.getMembersByTaskId(taskId);
    }
    async deleteTaskById(taskId) {
        const task = await this.taskController.getTaskById(taskId);
        if (task instanceof models_1.LogError)
            return false;
        if (!await this.taskController.deleteTasksById(taskId))
            return false;
        return await this.reorderPositionsInListAfterDeleted(task.listId, task.positionInList);
    }
    async updateTask(options) {
        const task = await this.taskController.getTaskById(options.taskId);
        if (task instanceof models_1.LogError)
            return task;
        if (options.statusId !== undefined) {
            const status = await this.statusService.getStatusById(options.statusId);
            if (status instanceof models_1.LogError)
                return status;
        }
        if (options.priorityId !== undefined) {
            const priority = await this.priorityService.getPriorityById(options.priorityId);
            if (priority instanceof models_1.LogError)
                return priority;
        }
        if (options.listId !== undefined && options.listId !== task.listId) {
            const list = await this.listService.getListById(options.listId);
            if (list instanceof models_1.LogError)
                return list;
            const positionInList = await this.getMaxPositionInListById(options.listId);
            if (positionInList instanceof models_1.LogError)
                return positionInList;
            options.positionInList = positionInList + 1;
        }
        const update = await this.taskController.updateTask(options);
        if (options.listId !== undefined && options.listId !== task.listId)
            await this.reorderPositionsInListAfterDeleted(task.listId, task.positionInList);
        return update;
    }
    async updatePositionInListTask(taskId, newPositionInList) {
        const task = await this.taskController.getTaskById(taskId);
        if (task instanceof models_1.LogError)
            return false;
        if (task.positionInList === newPositionInList)
            return true;
        return task.positionInList < newPositionInList ? await this.taskController.updatePositionInListTaskMinus(taskId, newPositionInList)
            : await this.taskController.updatePositionInListTaskPlus(taskId, newPositionInList);
    }
    async getMaxPositionInListById(listId) {
        const list = await this.listService.getListById(listId);
        if (list instanceof models_1.LogError)
            return list;
        return await this.taskController.getMaxPositionInListById(listId);
    }
    async reorderPositionsInListAfterDeleted(listId, positionDeleted) {
        const list = await this.listService.getListById(listId);
        if (list instanceof models_1.LogError)
            return false;
        const listTasks = await this.getAllTasksFromList(list.listId);
        if (listTasks instanceof models_1.LogError)
            return false;
        if (listTasks.length > 1 || (listTasks.length === 1 && listTasks[0].positionInList !== 1)) {
            if (positionDeleted !== 0) {
                return await this.taskController.reorderPositionsInListAfterDeleted(listId, positionDeleted);
            }
        }
        return true;
    }
    async getAllTasksFromList(listId, options) {
        return this.taskController.getAllTasksFromList(listId, options);
    }
    async assignUserToTask(taskId, userMail) {
        const task = await this.taskController.getTaskById(taskId);
        if (task instanceof models_1.LogError)
            return task;
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return user;
        return this.taskController.assignUserToTask(taskId, userMail);
    }
    async unassignUserToTask(taskId, userMail) {
        const task = await this.taskController.getTaskById(taskId);
        if (task instanceof models_1.LogError)
            return false;
        const user = await this.userService.getUserByMail(userMail);
        if (user instanceof models_1.LogError)
            return false;
        return this.taskController.unassignUserToTask(taskId, userMail);
    }
}
exports.TaskServiceImpl = TaskServiceImpl;
//# sourceMappingURL=task-service-impl.js.map