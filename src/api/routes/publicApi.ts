import express from "express";
import userRouter from "./user";
import writerRouter from "./writer";
import articleRouter from "./article";
import adminRouter from "./admin";
import consultantRouter from "./consultant";
export const publicRouter = express.Router();

publicRouter.use("/user", userRouter);
publicRouter.use("/writer", writerRouter);
publicRouter.use("/article", articleRouter);
publicRouter.use("/admin", adminRouter);
publicRouter.use("/consultant", consultantRouter);
