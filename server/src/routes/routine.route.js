import express from "express";
import {
  createRoutineEvent,
  fetchRoutineEvents,
  deleteRoutineEvent,
} from "../controllers/routine.controller.js";

const routineRouter = express.Router();

routineRouter.post("/classroom/routine/create", createRoutineEvent);
routineRouter.post("/classroom/routine/fetch", fetchRoutineEvents);
routineRouter.post("/classroom/routine/delete", deleteRoutineEvent);

export default routineRouter;
