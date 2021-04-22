import {ListController, ListGetAllOptions} from "../../controllers";
import {LogError, ListModel} from "../../models";
import {Connection} from "mysql2/promise";
import {ListService} from "../list-service";
import {BoardServiceImpl} from "./board-service-impl";

export interface ListUpdateProps {
    listId: number;
    listName: string;
    positionInBoard?: number;
    boardId: number;
}

export class ListServiceImpl implements ListService {

    private connection: Connection;
    private listController: ListController;
    private boardService: BoardServiceImpl;

    constructor(connection: Connection) {
        this.connection = connection;
        this.listController = new ListController(this.connection);
        this.boardService = new BoardServiceImpl(this.connection);
    }

    /**
     * Récupération de toutes les listes
     * @param options -> Limit et offset de la requete
     */
    async getAllLists(options?: ListGetAllOptions): Promise<ListModel[]> {
        return this.listController.getAllLists(options);
    }

    /**
     * Récupération de l'id de liste maximum existant
     */
    async getMaxListId(): Promise<number> {
        return this.listController.getMaxListId();
    }

    /**
     * Récupération d'une liste depuis son :
     * @param listId
     */
    getListById(listId: number): Promise<ListModel | LogError> {
        return this.listController.getListById(listId);
    }

    /**
     * Création d'une liste
     * @param options
     */
    async createList(options: ListModel): Promise<ListModel | LogError> {
        const board = await this.boardService.getBoardById(options.boardId);
        if (board instanceof LogError)
            return new LogError({numError: 404, text: "Board not exists"});

        return this.listController.createList(options);
    }

    /**
     * suppression d'une liste selon son id
     * @param listId
     */
    async deleteListById(listId: number): Promise<boolean> {
        const list = await this.listController.getListById(listId);
        if (list instanceof LogError)
            return false;

        if (!await this.listController.deleteListsById(listId))
            return false;

        return await this.reorderPositionsInBoard(list.boardId, list.positionInBoard);
    }

    /**
     * Modification des informations d'une liste renseignées dans les options
     * En cas de modification de tableau, la position dans le tableau est modifiée à la plus élevée existante
     * @param options
     */
    async updateList(options: ListUpdateProps): Promise<ListModel | LogError> {
        const list = await this.listController.getListById(options.listId);
        if (list instanceof LogError)
            return new LogError({numError: 404, text: "List not exists"});

        if(options.boardId !== undefined) {
            const board = await this.boardService.getBoardById(options.boardId);
            if (board instanceof LogError)
                return new LogError({numError: 404, text: "Board not exists"});

            const positionInBoard = await this.getMaxPositionInBoardById(options.boardId);
            if(positionInBoard instanceof LogError)
                return positionInBoard;

            options.positionInBoard = positionInBoard + 1;
        }

        const update = await this.listController.updateList(options);

        if(options.boardId !== undefined)
            await this.reorderPositionsInBoard(list.boardId, list.positionInBoard as number);

        return update;
    }

    /**
     * Modification de la position dans un tableau d'une liste selon son id
     * @param listId
     * @param newPositionInBoard
     */
    async updatePositionInBoardList(listId: number, newPositionInBoard: number): Promise<boolean> {
        const list = await this.listController.getListById(listId);
        if (list instanceof LogError)
            return false;

        if(list.positionInBoard === newPositionInBoard)
            return true;

        return list.positionInBoard < newPositionInBoard ? await this.listController.updatePositionInBoardListMinus(listId, newPositionInBoard)
            : await this.listController.updatePositionInBoardListPlus(listId, newPositionInBoard);
    }

    /**
     * récupération de la position maximale dans un tableau depuis son
     * @param boardId
     */
    async getMaxPositionInBoardById(boardId: number): Promise<number | LogError> {
        const board = await this.boardService.getBoardById(boardId);
        if (board instanceof LogError)
            return new LogError({numError: 404, text: "Board not exists"});

        return await this.listController.getMaxPositionInBoardById(boardId);
    }

    /**
     * Ordonner les positions dans le tableau après suppression
     * @param boardId
     * @param positionDeleted
     */
    async reorderPositionsInBoard(boardId: number, positionDeleted: number): Promise<boolean> {
        const board = await this.boardService.getBoardById(boardId);
        if (board instanceof LogError)
            return false;

        if (positionDeleted !== 0) {
            return await this.listController.reorderPositionsInBoard(boardId, positionDeleted);
        }
        return true;
    }

}