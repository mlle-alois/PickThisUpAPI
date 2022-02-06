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
exports.UserServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var models_1 = require("../../models");
var user_type_service_impl_1 = require("./user-type-service-impl");
var UserServiceImpl = /** @class */ (function () {
    function UserServiceImpl(connection) {
        this.connection = connection;
        this.userController = new controllers_1.UserController(this.connection);
        this.userTypeService = new user_type_service_impl_1.UserTypeServiceImpl(this.connection);
    }
    /**
     * Récupération de toutes les user
     * @param options -> Limit et offset de la requete
     */
    UserServiceImpl.prototype.getAllUsers = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userController.getAllUsers(options)];
            });
        });
    };
    /**
     * Récupération d'un user depuis son :
     * @param userId
     */
    UserServiceImpl.prototype.getUserByMail = function (userId) {
        return this.userController.getUserByMail(userId);
    };
    /**
     * Récupération d'un user depuis son :
     * @param mail
     * @param password
     */
    UserServiceImpl.prototype.getUserByMailAndPassword = function (mail, password) {
        return this.userController.getUserByMailAndPassword(mail, password);
    };
    /**
     * récupération des développeurs
     * @param options
     */
    UserServiceImpl.prototype.getAllDevelopers = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userController.getAllDevelopers(options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Récupération d'un user depuis son :
     * @param token
     */
    UserServiceImpl.prototype.getUserByToken = function (token) {
        return this.userController.getUserByToken(token);
    };
    /**
     * Modification des informations d'un user renseignées dans les options
     * @param options
     */
    UserServiceImpl.prototype.updateUser = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userController.getUserByMail(options.mail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.userController.updateUser(options)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Modification le statut d'un user renseignées dans les options
     * @param mail
     * @param status
     */
    UserServiceImpl.prototype.updateUserStatus = function (mail, status) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userController.getUserByMail(mail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.userController.updateUserStatus(mail, status)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Création d'un user
     * @param options
     */
    /*async createUser(options: UserModel): Promise<UserModel | LogError> {
        const userType = await this.userTypeService.getUserTypeById(options.typeId as number);
        if (userType instanceof LogError)
            return new LogError({numError: 404, text: "User type not exists"});

        return this.userController.createUser(options);
    }*/
    /**
     * suppression d'un user selon son id
     * @param mail
     */
    UserServiceImpl.prototype.deleteUserByMail = function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userController.getUserByMail(mail)];
                    case 1:
                        user = _a.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.userController.deleteUserByMail(mail)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return UserServiceImpl;
}());
exports.UserServiceImpl = UserServiceImpl;
