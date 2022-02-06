"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var models_1 = require("../../models");
var board_service_impl_1 = require("./board-service-impl");
var ListServiceImpl = /** @class */ (function () {
    function ListServiceImpl(connection) {
        this.connection = connection;
        this.listController = new controllers_1.ListController(this.connection);
        this.boardService = new board_service_impl_1.BoardServiceImpl(this.connection);
    }
    /**
     * Récupération de toutes les listes
     * @param options -> Limit et offset de la requete
     */
    ListServiceImpl.prototype.getAllLists = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.listController.getAllLists(options)];
            });
        });
    };
    /**
     * Récupération de l'id de liste maximum existant
     */
    ListServiceImpl.prototype.getMaxListId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.listController.getMaxListId()];
            });
        });
    };
    /**
     * Récupération d'une liste depuis son :
     * @param listId
     */
    ListServiceImpl.prototype.getListById = function (listId) {
        return this.listController.getListById(listId);
    };
    /**
     * Création d'une liste
     * @param options
     */
    ListServiceImpl.prototype.createList = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var board;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.boardService.getBoardById(options.boardId)];
                    case 1:
                        board = _a.sent();
                        if (board instanceof models_1.LogError)
                            return [2 /*return*/, board];
                        return [2 /*return*/, this.listController.createList(options)];
                }
            });
        });
    };
    /**
     * suppression d'une liste selon son id
     * @param listId
     */
    ListServiceImpl.prototype.deleteListById = function (listId) {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listController.getListById(listId)];
                    case 1:
                        list = _a.sent();
                        if (list instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.listController.deleteListsById(listId)];
                    case 2:
                        if (!(_a.sent()))
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.reorderPositionsInBoardAfterDeleted(list.boardId, list.positionInBoard)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Modification des informations d'une liste renseignées dans les options
     * En cas de modification de tableau, la position dans le tableau est modifiée à la plus élevée existante
     * @param options
     */
    ListServiceImpl.prototype.updateList = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var list, board, positionInBoard, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listController.getListById(options.listId)];
                    case 1:
                        list = _a.sent();
                        if (list instanceof models_1.LogError)
                            return [2 /*return*/, list];
                        if (!(options.boardId !== undefined && list.boardId !== options.boardId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.boardService.getBoardById(options.boardId)];
                    case 2:
                        board = _a.sent();
                        if (board instanceof models_1.LogError)
                            return [2 /*return*/, board];
                        return [4 /*yield*/, this.getMaxPositionInBoardById(options.boardId)];
                    case 3:
                        positionInBoard = _a.sent();
                        if (positionInBoard instanceof models_1.LogError)
                            return [2 /*return*/, positionInBoard];
                        options.positionInBoard = positionInBoard + 1;
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.listController.updateList(options)];
                    case 5:
                        update = _a.sent();
                        if (!(options.boardId !== undefined && list.boardId !== options.boardId)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.reorderPositionsInBoardAfterDeleted(list.boardId, list.positionInBoard)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, update];
                }
            });
        });
    };
    /**
     * Modification de la position dans un tableau d'une liste selon son id
     * @param listId
     * @param newPositionInBoard
     */
    ListServiceImpl.prototype.updatePositionInBoardList = function (listId, newPositionInBoard) {
        return __awaiter(this, void 0, void 0, function () {
            var list, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.listController.getListById(listId)];
                    case 1:
                        list = _b.sent();
                        if (list instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        if (list.positionInBoard === newPositionInBoard)
                            return [2 /*return*/, true];
                        if (!(list.positionInBoard < newPositionInBoard)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.listController.updatePositionInBoardListMinus(listId, newPositionInBoard)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.listController.updatePositionInBoardListPlus(listId, newPositionInBoard)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, _a];
                }
            });
        });
    };
    /**
     * récupération de la position maximale dans un tableau depuis son
     * @param boardId
     */
    ListServiceImpl.prototype.getMaxPositionInBoardById = function (boardId) {
        return __awaiter(this, void 0, void 0, function () {
            var board;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.boardService.getBoardById(boardId)];
                    case 1:
                        board = _a.sent();
                        if (board instanceof models_1.LogError)
                            return [2 /*return*/, board];
                        return [4 /*yield*/, this.listController.getMaxPositionInBoardById(boardId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Ordonner les positions dans le tableau après deleted
     * @param boardId
     * @param positionDeleted
     */
    ListServiceImpl.prototype.reorderPositionsInBoardAfterDeleted = function (boardId, positionDeleted) {
        return __awaiter(this, void 0, void 0, function () {
            var board, boardLists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.boardService.getBoardById(boardId)];
                    case 1:
                        board = _a.sent();
                        if (board instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.getListsByBoardId(board.boardId)];
                    case 2:
                        boardLists = _a.sent();
                        if (boardLists instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        if (!(boardLists.length > 1 || (boardLists.length === 1 && boardLists[0].positionInBoard !== 1))) return [3 /*break*/, 4];
                        if (!(positionDeleted !== 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.listController.reorderPositionsInBoardAfterDeleted(boardId, positionDeleted)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Récupère toutes les listes liés aux boards id
     * @param boardId
     */
    ListServiceImpl.prototype.getListsByBoardId = function (boardId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.listController.getListByBoardId(boardId)];
            });
        });
    };
    return ListServiceImpl;
}());
exports.ListServiceImpl = ListServiceImpl;
