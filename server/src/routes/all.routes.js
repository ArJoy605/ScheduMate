import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import classroomRouter from "./classroom.routes.js";
import routineRouter from "./routine.route.js";
import calendarRouter from "./calendar.routes.js";

const router = express.Router();

router.use(authRouter);
router.use(userRouter);
router.use(classroomRouter);
router.use(routineRouter);
router.use(calendarRouter);

export default router;
