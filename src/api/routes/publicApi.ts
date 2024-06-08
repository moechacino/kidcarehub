import express from "express";
import userRouter from "./user";
import writerRouter from "./writer";
import articleRouter from "./article";
import adminRouter from "./admin";
export const publicRouter = express.Router();

publicRouter.use("/user", userRouter);
publicRouter.use("/writer", writerRouter);
publicRouter.use("/article", articleRouter);
publicRouter.use("/admin", adminRouter);
