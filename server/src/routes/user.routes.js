import express from "express";
import { getLoginStatus, getProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile", getProfile);
userRouter.get("/login-status", getLoginStatus);

export default userRouter;
