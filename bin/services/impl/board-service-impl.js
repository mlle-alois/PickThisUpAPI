"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardServiceImpl = void 0;
const controllers_1 = require("../../controllers");
class BoardServiceImpl {
    constructor(connection) {
        this.connection = connection;
        this.boardController = new controllers_1.BoardController(this.connection);
    }
    async getAllBoards(options) {
        return this.boardController.getAllBoards(options);
    }
    async getMaxBoardId() {
        return this.boardController.getMaxBoardId();
    }
    getBoardById(boardId) {
        return this.boardController.getBoardById(boardId);
    }
    async createBoard(options) {
        return this.boardController.createBoard(options);
    }
    deleteBoardsById(boardId) {
        return this.boardController.deleteBoardsById(boardId);
    }
    async updateBoard(options) {
        return await this.boardController.updateBoard(options);
    }
}
exports.BoardServiceImpl = BoardServiceImpl;
//# sourceMappingURL=board-service-impl.js.map