import express from "express";
import { WriterController } from "../../controllers/writerController";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";
import { OnlyAccessedBy } from "../../middlewares/onlyAccessedBy";

const writerRouter = express.Router();

writerRouter
  .route("/register")
  .post(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.admin,
    WriterController.register
  );
writerRouter.route("/login").post(WriterController.login);
writerRouter
  .route("/logout")
  .patch(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.writer,
    WriterController.logout
  );

writerRouter
  .route("/change-password")
  .patch(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.writer,
    WriterController.changePassword
  );

export default writerRouter;
