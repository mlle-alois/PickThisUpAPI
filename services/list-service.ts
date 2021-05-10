import {LogError, ListModel} from "../models";
import {ListGetAllOptions, ListUpdateProps} from "../controllers";

export interface ListService {

    getAllLists(options?: ListGetAllOptions): Promise<ListModel[]>;

    getMaxListId(): Promise<number>;

    getListById(listId: number): Promise<ListModel | LogError>;

    createList(options: ListModel): Promise<ListModel | LogError>;

    deleteListById(listId: number): Promise<boolean>;

    updateList(options: ListUpdateProps): Promise<ListModel | LogError>;

    updatePositionInBoardList(listId: number, positionInBoard: number): Promise<boolean>;

    getMaxPositionInBoardById(boardId: number): Promise<number | LogError>;

    reorderPositionsInBoardAfterDeleted(boardId: number, positionDeleted: number): Promise<boolean>;

    getListsByBoardId(boardId: number): Promise<ListModel[] | LogError>;
}