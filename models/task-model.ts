export interface ITaskProps {
    taskId: number;
    taskName: string;
    taskDescription: string;
    taskCreationDate: Date;
    taskDeadline?: Date;
    positionInList: number;
    statusId?: number;
    priorityId?: number;
    listId: number;
    creatorId: string;
}

export class TaskModel implements ITaskProps {
    taskId: number;
    taskName: string;
    taskDescription: string;
    taskCreationDate: Date;
    taskDeadline?: Date;
    positionInList: number;
    statusId?: number;
    priorityId?: number;
    listId: number;
    creatorId: string;

    constructor(properties: ITaskProps) {
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