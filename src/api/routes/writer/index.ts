import express from "express";
import { WriterController } from "../../controllers/writerController";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";

const writerRouter = express.Router();

writerRouter.route("/register").post(WriterController.register);
writerRouter.route("/login").post(WriterController.login);
writerRouter
  .route("/logout")
  .post(authenticationMiddleware, verifyToken, WriterController.logout);

export default writerRouter;
