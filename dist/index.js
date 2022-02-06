"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const cors = require('cors');
app.use(cors());
app.use(body_parser_1.default.json());
(0, routes_1.buildRoutes)(app);
const port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log(`Listening on ${port}...`);
});
//# sourceMappingURL=index.js.map