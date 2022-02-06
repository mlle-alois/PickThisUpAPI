"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
var TaskModel = /** @class */ (function () {
    function TaskModel(properties) {
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
    return TaskModel;
}());
exports.TaskModel = TaskModel;
