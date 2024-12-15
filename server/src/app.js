import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/all.routes.js";
import { handleError } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);
app.use(handleError);

export default app;
