import {LogError, BoardModel, UserModel} from "../models";
import {BoardGetAllOptions, IUserCreationProps} from "../controllers";

export interface BoardService {

    getAllBoards(options?: BoardGetAllOptions): Promise<BoardModel[]>;

    getMaxBoardId(): Promise<number>;

    getBoardById(boardId: number): Promise<BoardModel | LogError>;

    createBoard(options: BoardModel): Promise<BoardModel | LogError>;

    deleteBoardsById(boardId: number): Promise<boolean>;

    updateBoard(options: BoardModel): Promise<BoardModel | LogError>;
}