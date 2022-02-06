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
exports.ListController = void 0;
var models_1 = require("../models");
var ListController = /** @class */ (function () {
    function ListController(connection) {
        this.connection = connection;
    }
    ListController.prototype.getAllLists = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, offset, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        limit = (options === null || options === void 0 ? void 0 : options.limit) || 20;
                        offset = (options === null || options === void 0 ? void 0 : options.offset) || 0;
                        return [4 /*yield*/, this.connection.query("SELECT list_id, list_name, position_in_board, board_id\n                                                 FROM LIST LIMIT ?, ?", [
                                offset, limit
                            ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.ListModel({
                                        listId: row["list_id"],
                                        listName: row["list_name"],
                                        positionInBoard: row["position_in_board"],
                                        boardId: row["board_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    ListController.prototype.getListById = function (listId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT list_id, list_name, position_in_board, board_id\n                                                 FROM LIST\n                                                 where list_id = ?", [
                            listId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.ListModel({
                                        listId: row["list_id"],
                                        listName: row["list_name"],
                                        positionInBoard: row["position_in_board"],
                                        boardId: row["board_id"]
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "List not found" })];
                }
            });
        });
    };
    ListController.prototype.getMaxListId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query('SELECT MAX(list_id) as maxId FROM LIST')];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                if (row["maxId"] === null) {
                                    return [2 /*return*/, 0];
                                }
                                else {
                                    return [2 /*return*/, row["maxId"]];
                                }
                            }
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    ListController.prototype.createList = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("INSERT INTO LIST (list_id, list_name, position_in_board, board_id)\n                                           VALUES (?, ?, ?, ?)", [
                                options.listId,
                                options.listName,
                                options.positionInBoard,
                                options.boardId
                            ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getListById(options.listId)];
                    case 2: 
                    //récupération de la list créée ou null si cela n'a pas fonctionné
                    return [2 /*return*/, _a.sent()];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Error during list creation" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ListController.prototype.deleteListsById = function (listId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connection.query("DELETE\n                                                     FROM LIST\n                                                     WHERE list_id = ?", [
                                listId
                            ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 2:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ListController.prototype.updateList = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var setClause, params, res, headers, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setClause = [];
                        params = [];
                        //création des contenus de la requête dynamiquement
                        if (options.listName !== undefined) {
                            setClause.push("list_name = ?");
                            params.push(options.listName);
                        }
                        if (options.boardId !== undefined) {
                            setClause.push("board_id = ?");
                            params.push(options.boardId);
                            setClause.push("position_in_board = ?");
                            params.push(options.positionInBoard);
                        }
                        params.push(options.listId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.execute("UPDATE LIST SET ".concat(setClause.join(", "), " WHERE list_id = ?"), params)];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        if (headers.affectedRows > 0) {
                            return [2 /*return*/, this.getListById(options.listId)];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The list update failed" })];
                    case 3:
                        err_3 = _a.sent();
                        console.error(err_3);
                        return [2 /*return*/, new models_1.LogError({ numError: 400, text: "The list update failed" })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ListController.prototype.getMaxPositionInBoardById = function (boardId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT COALESCE(MAX(position_in_board), 0) as maxId\n                                                 FROM BOARD\n                                                          INNER JOIN LIST ON LIST.board_id = BOARD.board_id\n                                                     AND BOARD.board_id = ?", [
                            boardId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                if (row["maxId"] === null) {
                                    return [2 /*return*/, 0];
                                }
                                else {
                                    return [2 /*return*/, row["maxId"]];
                                }
                            }
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    ListController.prototype.reorderPositionsInBoardAfterDeleted = function (listId, positionDeleted) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("UPDATE LIST\n                                                 SET position_in_board = position_in_board - 1\n                                                 WHERE board_id = ?\n                                                   AND position_in_board >= ?", [
                            listId,
                            positionDeleted
                        ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                }
            });
        });
    };
    ListController.prototype.updatePositionInBoardListPlus = function (listId, newPositionInBoard) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("UPDATE LIST\n                                               SET position_in_board = position_in_board + 1\n                                               WHERE board_id = (SELECT board_id\n                                                                 FROM LIST\n                                                                 WHERE list_id = ?)\n                                                 AND position_in_board >= ?\n                                                 AND position_in_board < (SELECT position_in_board\n                                                                          FROM LIST\n                                                                          WHERE list_id = ?)", [
                            listId,
                            newPositionInBoard,
                            listId
                        ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (!(headers.affectedRows > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.connection.query("UPDATE LIST\n                                               SET position_in_board = ?\n                                               WHERE list_id = ?", [
                                newPositionInBoard,
                                listId
                            ])];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    ListController.prototype.updatePositionInBoardListMinus = function (listId, newPositionInBoard) {
        return __awaiter(this, void 0, void 0, function () {
            var res, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("UPDATE LIST\n                                               SET position_in_board = position_in_board - 1\n                                               WHERE board_id = (SELECT board_id\n                                                                 FROM LIST\n                                                                 WHERE list_id = ?)\n                                                 AND position_in_board > (SELECT position_in_board\n                                                                          FROM LIST\n                                                                          WHERE list_id = ?)\n                                                 AND position_in_board <= ?", [
                            listId,
                            listId,
                            newPositionInBoard
                        ])];
                    case 1:
                        res = _a.sent();
                        headers = res[0];
                        if (!(headers.affectedRows > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.connection.query("UPDATE LIST\n                                               SET position_in_board = ?\n                                               WHERE list_id = ?", [
                                newPositionInBoard,
                                listId
                            ])];
                    case 2:
                        res = _a.sent();
                        headers = res[0];
                        return [2 /*return*/, headers.affectedRows > 0];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    ListController.prototype.getListByBoardId = function (boardId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT list_id, list_name, position_in_board, board_id\n                                                 FROM LIST\n                                                 where board_id = ?", [
                            boardId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            return [2 /*return*/, data.map(function (row) {
                                    return new models_1.ListModel({
                                        listId: row["list_id"],
                                        listName: row["list_name"],
                                        positionInBoard: row["position_in_board"],
                                        boardId: row["board_id"]
                                    });
                                })];
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "List not found" })];
                }
            });
        });
    };
    return ListController;
}());
exports.ListController = ListController;
