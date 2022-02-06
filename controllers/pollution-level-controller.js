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
exports.PollutionLevelController = void 0;
var models_1 = require("../models");
var PollutionLevelController = /** @class */ (function () {
    function PollutionLevelController(connection) {
        this.connection = connection;
    }
    /**
     * Récupération d'un type utilisateur depuis son :
     * @param pollutionLevelId
     */
    PollutionLevelController.prototype.getPollutionLevelById = function (pollutionLevelId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, rows, row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query("SELECT pollution_level_id,\n                                                        pollution_level_libelle\n                                                 FROM POLLUTION_LEVEL\n                                                 where pollution_level_id = ?", [
                            pollutionLevelId
                        ])];
                    case 1:
                        res = _a.sent();
                        data = res[0];
                        if (Array.isArray(data)) {
                            rows = data;
                            if (rows.length > 0) {
                                row = rows[0];
                                return [2 /*return*/, new models_1.PollutionLevelModel({
                                        pollutionLevelId: row["pollution_level_id"],
                                        pollutionLevelLibelle: row["pollution_level_libelle"]
                                    })];
                            }
                        }
                        return [2 /*return*/, new models_1.LogError({ numError: 404, text: "User type not found" })];
                }
            });
        });
    };
    return PollutionLevelController;
}());
exports.PollutionLevelController = PollutionLevelController;
