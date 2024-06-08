import express from "express";
import { UserController } from "../../controllers/userController";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";

const userRouter = express.Router();

userRouter.route("/register").post(UserController.register);
userRouter.route("/login").post(UserController.login);
userRouter
  .route("/logout")
  .patch(authenticationMiddleware, verifyToken, UserController.logout);

export default userRouter;
