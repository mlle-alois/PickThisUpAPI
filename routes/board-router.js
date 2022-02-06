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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardRouter = void 0;
var express_1 = __importDefault(require("express"));
var database_1 = require("../database/database");
var auth_middleware_1 = require("../middlewares/auth-middleware");
var Utils_1 = require("../Utils");
var impl_1 = require("../services/impl");
var models_1 = require("../models");
var boardRouter = express_1.default.Router();
exports.boardRouter = boardRouter;
/**
 * ajout d'un tableau
 * URL : /board/add
 * Requete : POST
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.post("/add", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, boardService, id, name_1, board, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 5];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    boardService = new impl_1.BoardServiceImpl(connection);
                    return [4 /*yield*/, boardService.getMaxBoardId()];
                case 3:
                    id = (_a.sent()) + 1;
                    name_1 = req.body.name;
                    if (name_1 === undefined) {
                        res.status(400).end("Veuillez renseigner les informations nécessaires");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, boardService.createBoard({
                            boardId: id,
                            boardName: name_1
                        })];
                case 4:
                    board = _a.sent();
                    if (board instanceof models_1.LogError) {
                        models_1.LogError.HandleStatus(res, board);
                    }
                    else {
                        res.status(201);
                        res.json(board);
                    }
                    _a.label = 5;
                case 5:
                    res.status(403).end();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    next(err_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération de tous les tableaux
 * URL : /board?[limit={x}&offset={x}]
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.get("/", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, boardService, limit, offset, boardList, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    boardService = new impl_1.BoardServiceImpl(connection);
                    limit = req.query.limit ? Number.parseInt(req.query.limit) : undefined;
                    offset = req.query.offset ? Number.parseInt(req.query.offset) : undefined;
                    return [4 /*yield*/, boardService.getAllBoards({
                            limit: limit,
                            offset: offset
                        })];
                case 3:
                    boardList = _a.sent();
                    res.json(boardList);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    next(err_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * récupération d'un tableau selon son id
 * URL : /board/:id
 * Requete : GET
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.get("/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, boardService, id, board, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    boardService = new impl_1.BoardServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, boardService.getBoardById(Number.parseInt(id))];
                case 3:
                    board = _a.sent();
                    if (board instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, board);
                    else
                        res.json(board);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _a.sent();
                    next(err_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * modification d'un tableau selon son id
 * URL : /board/:id
 * Requete : PUT
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.put("/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, name_2, connection, boardService, board, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    id = req.params.id;
                    name_2 = req.body.name;
                    //invalide s'il n'y a pas d'id ou qu'aucune option à modifier n'est renseignée
                    if (id === undefined || name_2 === undefined) {
                        res.status(400).end();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    boardService = new impl_1.BoardServiceImpl(connection);
                    return [4 /*yield*/, boardService.updateBoard({
                            boardId: Number.parseInt(id),
                            boardName: name_2,
                        })];
                case 3:
                    board = _a.sent();
                    if (board instanceof models_1.LogError)
                        models_1.LogError.HandleStatus(res, board);
                    else
                        res.json(board);
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_4 = _a.sent();
                    next(err_4);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * suppression d'un tableau selon son id
 * URL : /board/:id
 * Requete : DELETE
 * ACCES : DEVELOPPEUR
 * Nécessite d'être connecté : OUI
 */
boardRouter.delete("/:id", auth_middleware_1.authUserMiddleWare, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var connection, boardService, id, success, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Utils_1.isDevConnected)(req)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.DatabaseUtils.getConnection()];
                case 2:
                    connection = _a.sent();
                    boardService = new impl_1.BoardServiceImpl(connection);
                    id = req.params.id;
                    if (id === undefined)
                        return [2 /*return*/, res.status(400).end("Veuillez renseigner les informations nécessaires")];
                    return [4 /*yield*/, boardService.deleteBoardsById(Number.parseInt(id))];
                case 3:
                    success = _a.sent();
                    if (success)
                        res.status(204).end();
                    else
                        res.status(404).end();
                    _a.label = 4;
                case 4:
                    res.status(403).end();
                    return [3 /*break*/, 6];
                case 5:
                    err_5 = _a.sent();
                    next(err_5);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
