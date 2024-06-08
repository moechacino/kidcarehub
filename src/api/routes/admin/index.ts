import express from "express";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";
import { AdminController } from "../../controllers/adminController";
import { OnlyAccessedBy } from "../../middlewares/onlyAccessedBy";
const adminRouter = express.Router();

adminRouter.route("/login").post(AdminController.login);
adminRouter
  .route("/logout")
  .patch(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.admin,
    AdminController.logout
  );

export default adminRouter;
