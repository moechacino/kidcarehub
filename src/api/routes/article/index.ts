import express from "express";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";
import { articleController } from "../../controllers/articleController";
import uploadMiddleware from "../../middlewares/multer";
import { OnlyAccessedBy } from "../../middlewares/onlyAccessedBy";

const articleRouter = express.Router();

articleRouter.route("/create").post(
  authenticationMiddleware,
  verifyToken,
  OnlyAccessedBy.writer,
  uploadMiddleware.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 20,
    },
  ]),
  articleController.create
);

articleRouter.route("/:articleId/edit").patch(
  authenticationMiddleware,
  verifyToken,
  OnlyAccessedBy.writer,
  uploadMiddleware.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "newImage",
      maxCount: 20,
    },
  ]),
  articleController.edit
);

articleRouter
  .route("/:articleId/delete")
  .delete(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.writer,
    articleController.delete
  );

articleRouter.route("/").get(articleController.getAllArticle);
articleRouter.route("/:articleId").get(articleController.getOneArticle);

export default articleRouter;
