import {LogError, TaskModel, UserModel} from "../models";
import {TaskGetAllOptions, TaskUpdateOptions} from "../controllers";

export interface TaskService {

    getAllTasks(options?: TaskGetAllOptions): Promise<TaskModel[]>;

    getMaxTaskId(): Promise<number>;

    getTaskById(taskId: number): Promise<TaskModel | LogError>;

    createTask(options: TaskModel): Promise<TaskModel | LogError>;

    getMembersByTaskId(taskId: number): Promise<UserModel[]>;

    deleteTaskById(taskId: number): Promise<boolean>;

    updateTask(options: TaskUpdateOptions): Promise<TaskModel | LogError>;

    updatePositionInListTask(taskId: number, positionInList: number): Promise<boolean>;

    getMaxPositionInListById(boardId: number): Promise<number | LogError>;

    reorderPositionsInListAfterDeleted(listId: number, positionDeleted: number): Promise<boolean>;

    getAllTasksFromList(listId: number, options?: TaskGetAllOptions,): Promise<TaskModel[] | LogError>;

    assignUserToTask(taskId: number, userMail: string): Promise<TaskModel | LogError>;

    unassignUserToTask(taskId: number, userMail: string): Promise<boolean>;

}