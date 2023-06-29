import express from "express";
import { Request, Response } from "express";
import dotenv from 'dotenv'
import  Knex  from "knex";

dotenv.config()

const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req: Request, res: Response) {
  res.end("Hello World!!!!!");
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});