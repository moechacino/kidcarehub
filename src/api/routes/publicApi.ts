import express from "express";
import userRouter from "./user";
import writerRouter from "./writer";
export const publicRouter = express.Router();

publicRouter.use("/user", userRouter);
publicRouter.use("/writer", writerRouter);
