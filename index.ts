import {config} from "dotenv";
config();
import express, {Express} from "express";
import {buildRoutes} from "./routes";
import bodyParser from "body-parser";

const app: Express = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

buildRoutes(app);

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Listening on ${port}...`);
});
