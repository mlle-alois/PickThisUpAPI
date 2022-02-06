"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
class TaskModel {
    constructor(properties) {
        this.taskId = properties.taskId;
        this.taskName = properties.taskName;
        this.taskDescription = properties.taskDescription;
        this.taskCreationDate = properties.taskCreationDate;
        this.taskDeadline = properties.taskDeadline;
        this.positionInList = properties.positionInList;
        this.statusId = properties.statusId;
        this.priorityId = properties.priorityId;
        this.listId = properties.listId;
        this.creatorId = properties.creatorId;
    }
}
exports.TaskModel = TaskModel;
//# sourceMappingURL=task-model.js.map