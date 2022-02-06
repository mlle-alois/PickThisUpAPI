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
exports.AuthServiceImpl = void 0;
var controllers_1 = require("../../controllers");
var models_1 = require("../../models");
var bcrypt_1 = require("bcrypt");
var controllers_2 = require("../../controllers");
var user_service_impl_1 = require("./user-service-impl");
var AuthServiceImpl = /** @class */ (function () {
    function AuthServiceImpl(connection) {
        this.connection = connection;
        this.userService = new user_service_impl_1.UserServiceImpl(this.connection);
        this.authController = new controllers_1.AuthController(this.connection);
        this.sessionController = new controllers_1.SessionController(this.connection);
        this.userTypeController = new controllers_2.UserTypeController(this.connection);
    }
    /**
     * Inscription de l'utilisateur
     * @param properties -> Informations de l'utilisateur entrées en base (mot de passe haché par le code)
     */
    AuthServiceImpl.prototype.subscribe = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            var user, typeUser, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMail(properties.userMail)];
                    case 1:
                        user = _b.sent();
                        if (!(user instanceof models_1.LogError))
                            return [2 /*return*/, new models_1.LogError({ numError: 409, text: "Mail is already used" })];
                        return [4 /*yield*/, this.userTypeController.getUserTypeById(properties.userTypeId)];
                    case 2:
                        typeUser = _b.sent();
                        if (typeUser instanceof models_1.LogError) {
                            return [2 /*return*/, new models_1.LogError({ numError: 400, text: "User type don't exists" })];
                        }
                        //hachage du mot de passe
                        _a = properties;
                        return [4 /*yield*/, (0, bcrypt_1.hash)(properties.userPassword, 5)];
                    case 3:
                        //hachage du mot de passe
                        _a.userPassword = _b.sent();
                        return [2 /*return*/, this.authController.createUser(properties)];
                }
            });
        });
    };
    /**
     * login de l'utilisateur via :
     * @param mail
     * @param password
     * Récupération de la session créée
     */
    AuthServiceImpl.prototype.login = function (mail, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, token, _a, _b, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByMailAndPassword(mail, password)];
                    case 1:
                        user = _c.sent();
                        if (user instanceof models_1.LogError)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, (0, bcrypt_1.hash)(Date.now() + mail, 5)];
                    case 2:
                        token = _c.sent();
                        token = token.replace('/', '');
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 7, , 8]);
                        //suppression des anciennes sessions non fermées
                        return [4 /*yield*/, this.sessionController.deleteOldSessionsByUserMail(mail)];
                    case 4:
                        //suppression des anciennes sessions non fermées
                        _c.sent();
                        _b = (_a = this.sessionController).createSession;
                        return [4 /*yield*/, this.sessionController.getMaxSessionId()];
                    case 5: return [4 /*yield*/, _b.apply(_a, [(_c.sent()) + 1, token, mail])];
                    case 6: 
                    //création et récupération de la session
                    return [2 /*return*/, _c.sent()];
                    case 7:
                        err_1 = _c.sent();
                        console.error(err_1);
                        return [2 /*return*/, new models_1.LogError({ numError: 500, text: "Connection failed" })];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return AuthServiceImpl;
}());
exports.AuthServiceImpl = AuthServiceImpl;
