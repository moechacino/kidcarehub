import express from "express";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";
import { AdminController } from "../../controllers/adminController";
const adminRouter = express.Router();

adminRouter.route("/login").post(AdminController.login);
adminRouter
  .route("/logout")
  .patch(authenticationMiddleware, verifyToken, AdminController.logout);

export default adminRouter;
