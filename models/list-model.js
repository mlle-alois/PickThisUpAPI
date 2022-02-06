"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListModel = void 0;
var ListModel = /** @class */ (function () {
    function ListModel(properties) {
        this.listId = properties.listId;
        this.listName = properties.listName;
        this.boardId = properties.boardId;
        this.positionInBoard = properties.positionInBoard;
    }
    return ListModel;
}());
exports.ListModel = ListModel;
