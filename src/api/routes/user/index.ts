import express from "express";
import { UserController } from "../../controllers/userController";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";
import { OnlyAccessedBy } from "../../middlewares/onlyAccessedBy";

const userRouter = express.Router();

userRouter.route("/register").post(UserController.register);
userRouter.route("/login").post(UserController.login);
userRouter
  .route("/logout")
  .patch(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.user,
    UserController.logout
  );

export default userRouter;
