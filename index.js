"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes");
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1.default)();
var cors = require('cors');
app.use(cors());
app.use(body_parser_1.default.json());
(0, routes_1.buildRoutes)(app);
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Listening on ".concat(port, "..."));
});
