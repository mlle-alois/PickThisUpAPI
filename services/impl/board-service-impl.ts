import {AuthController, BoardController, BoardGetAllOptions, UserController} from "../../controllers";
import {LogError, BoardModel} from "../../models";
import {Connection} from "mysql2/promise";
import {BoardService} from "../board-service";

export class BoardServiceImpl implements BoardService {

    private connection: Connection;
    private boardController: BoardController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.boardController = new BoardController(this.connection);
    }

    /**
     * Récupération de tous les tableaux
     * @param options -> Limit et offset de la requete
     */
    async getAllBoards(options?: BoardGetAllOptions): Promise<BoardModel[]> {
        return this.boardController.getAllBoards(options);
    }

    /**
     * Récupération de l'id de board maximum existant
     */
    async getMaxBoardId(): Promise<number> {
        return this.boardController.getMaxBoardId();
    }

    /**
     * Récupération d'un tableau depuis son :
     * @param boardId
     */
    getBoardById(boardId: number): Promise<BoardModel | LogError> {
        return this.boardController.getBoardById(boardId);
    }

    /**
     * Création d'un board
     * @param options
     */
    async createBoard(options: BoardModel): Promise<BoardModel | LogError> {
        return this.boardController.createBoard(options);
    }

    /**
     * suppression deu tableau selon son id
     * @param boardId
     */
    deleteBoardsById(boardId: number): Promise<boolean> {
        return this.boardController.deleteBoardsById(boardId);
    }

    /**
     * Modification des informations d'un tableau renseignées dans les options
     * @param options
     */
    async updateBoard(options: BoardModel): Promise<BoardModel | LogError> {
        return await this.boardController.updateBoard(options);
    }

}