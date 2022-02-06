"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceImpl = void 0;
const controllers_1 = require("../../controllers");
const models_1 = require("../../models");
const board_service_impl_1 = require("./board-service-impl");
class ListServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.listController = new controllers_1.ListController(this.connection);
        this.boardService = new board_service_impl_1.BoardServiceImpl(this.connection);
    }
    async getAllLists(options) {
        return this.listController.getAllLists(options);
    }
    async getMaxListId() {
        return this.listController.getMaxListId();
    }
    getListById(listId) {
        return this.listController.getListById(listId);
    }
    async createList(options) {
        const board = await this.boardService.getBoardById(options.boardId);
        if (board instanceof models_1.LogError)
            return board;
        return this.listController.createList(options);
    }
    async deleteListById(listId) {
        const list = await this.listController.getListById(listId);
        if (list instanceof models_1.LogError)
            return false;
        if (!await this.listController.deleteListsById(listId))
            return false;
        return await this.reorderPositionsInBoardAfterDeleted(list.boardId, list.positionInBoard);
    }
    async updateList(options) {
        const list = await this.listController.getListById(options.listId);
        if (list instanceof models_1.LogError)
            return list;
        if (options.boardId !== undefined && list.boardId !== options.boardId) {
            const board = await this.boardService.getBoardById(options.boardId);
            if (board instanceof models_1.LogError)
                return board;
            const positionInBoard = await this.getMaxPositionInBoardById(options.boardId);
            if (positionInBoard instanceof models_1.LogError)
                return positionInBoard;
            options.positionInBoard = positionInBoard + 1;
        }
        const update = await this.listController.updateList(options);
        if (options.boardId !== undefined && list.boardId !== options.boardId)
            await this.reorderPositionsInBoardAfterDeleted(list.boardId, list.positionInBoard);
        return update;
    }
    async updatePositionInBoardList(listId, newPositionInBoard) {
        const list = await this.listController.getListById(listId);
        if (list instanceof models_1.LogError)
            return false;
        if (list.positionInBoard === newPositionInBoard)
            return true;
        return list.positionInBoard < newPositionInBoard ? await this.listController.updatePositionInBoardListMinus(listId, newPositionInBoard)
            : await this.listController.updatePositionInBoardListPlus(listId, newPositionInBoard);
    }
    async getMaxPositionInBoardById(boardId) {
        const board = await this.boardService.getBoardById(boardId);
        if (board instanceof models_1.LogError)
            return board;
        return await this.listController.getMaxPositionInBoardById(boardId);
    }
    async reorderPositionsInBoardAfterDeleted(boardId, positionDeleted) {
        const board = await this.boardService.getBoardById(boardId);
        if (board instanceof models_1.LogError)
            return false;
        const boardLists = await this.getListsByBoardId(board.boardId);
        if (boardLists instanceof models_1.LogError)
            return false;
        if (boardLists.length > 1 || (boardLists.length === 1 && boardLists[0].positionInBoard !== 1)) {
            if (positionDeleted !== 0) {
                return await this.listController.reorderPositionsInBoardAfterDeleted(boardId, positionDeleted);
            }
        }
        return true;
    }
    async getListsByBoardId(boardId) {
        return this.listController.getListByBoardId(boardId);
    }
}
exports.ListServiceImpl = ListServiceImpl;
//# sourceMappingURL=list-service-impl.js.map