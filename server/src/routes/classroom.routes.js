import express from "express";
import {
  changeRole,
  createClass,
  getClassAndUserList,
  joinClass,
} from "../controllers/classroom.controller.js";

const classroomRouter = express.Router();

classroomRouter.post("/classroom/create", createClass);
classroomRouter.post("/classroom/class&UserList", getClassAndUserList);
classroomRouter.post("/classroom/join", joinClass);
classroomRouter.post("/classroom/change-role", changeRole);

export default classroomRouter;
