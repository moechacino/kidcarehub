import express from "express";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";
import { OnlyAccessedBy } from "../../middlewares/onlyAccessedBy";
import { ConsultantController } from "../../controllers/consultantController";
const consultantRouter = express.Router();

consultantRouter
  .route("/register")
  .post(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.admin,
    ConsultantController.register
  );

consultantRouter
  .route("/logout")
  .patch(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.consultant,
    ConsultantController.logout
  );

consultantRouter
  .route("/change-password")
  .patch(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.consultant,
    ConsultantController.changePassword
  );

consultantRouter.route("/login").post(ConsultantController.login);
consultantRouter.route("/").get(ConsultantController.getAll);
consultantRouter.route("/:consultantId").get(ConsultantController.getOne);
export default consultantRouter;
