import express from "express";
import { Request, Response } from "express";
import dotenv from 'dotenv'
import  Knex  from "knex";
import { AuthService } from "./services/authService";
import { AuthController } from "./controllers/authController";
import { authRouter, eventRouter, expenseRouter, tripRouter } from "./Router";
import { User } from "./services/models";
import cors from 'cors'
import { TripService } from "./services/tripService";
import { TripController } from "./controllers/tripController";
import { EventService } from "./services/eventService";
import { EventController } from "./controllers/eventController";
import { ExpenseService } from "./services/ExpenseService";
import { ExpenseController } from "./controllers/expenseController";

dotenv.config()

const knexConfigs = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
const knexConfig = knexConfigs[configMode];
export const knex = Knex(knexConfig);

declare global {
  namespace Express{
    interface Request{
      user?: Omit<User,'password'>
    }
  }
}

export const authService = new AuthService(knex)
export const authController = new AuthController(authService)
export const tripService = new TripService(knex)
export const tripController = new TripController(tripService)
export const eventService = new EventService(knex)
export const eventController = new EventController(eventService)
export const expenseService = new ExpenseService(knex)
export const expenseController = new ExpenseController(expenseService)

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// remove
app.get("/", function (req: Request, res: Response) {
  res.end("backend testing");
});

app.use('/auth', authRouter())
app.use('/home', tripRouter())
app.use('/event', eventRouter())
app.use('/expense', expenseRouter())

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});