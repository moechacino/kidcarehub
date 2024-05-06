import express from "express";
import { UserController } from "../controllers/userController";

export const publicRouter = express.Router();
publicRouter.route("/api/v1/user/register").post(UserController.register);
publicRouter.route("/api/v1/user/login").post(UserController.login);
