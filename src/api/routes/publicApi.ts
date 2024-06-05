import express from "express";
import { UserController } from "../controllers/userController";

export const publicRouter = express.Router();

publicRouter.route("/user/register").post(UserController.register);
publicRouter.route("/user/login").post(UserController.login);
publicRouter.route("/user/logout").post(UserController.logout);
