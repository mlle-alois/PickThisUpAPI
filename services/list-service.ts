import {LogError, ListModel, UserModel} from "../models";
import {ListGetAllOptions, IUserCreationProps} from "../controllers";
import {ListUpdateProps} from "./impl";

export interface ListService {

    getAllLists(options?: ListGetAllOptions): Promise<ListModel[]>;

    getMaxListId(): Promise<number>;

    getListById(listId: number): Promise<ListModel | LogError>;

    createList(options: ListModel): Promise<ListModel | LogError>;

    deleteListById(listId: number): Promise<boolean>;

    updateList(options: ListUpdateProps): Promise<ListModel | LogError>;

    updatePositionInBoardList(listId: number, positionInBoard: number): Promise<boolean>;

    getMaxPositionInBoardById(boardId: number): Promise<number | LogError>;
}