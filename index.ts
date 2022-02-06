import {config} from "dotenv";
config();
import express, {Express} from "express";
import {buildRoutes} from "./routes";
import bodyParser from "body-parser";
import path from "path";

const app: Express = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

buildRoutes(app);

const port = process.env.PORT || 8080;

app.listen(port, function () {
    console.log(`Listening on ${port}...`);
});
