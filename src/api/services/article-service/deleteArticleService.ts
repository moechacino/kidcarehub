import fs from "fs";
import path from "path";
import { prismaClient } from "../../../config/database";
import { NotFoundError } from "../../errors/NotFoundError";
import { ArticleResponse, toArticleResponse } from "../../models/articleModels";

export class DeleteArticleService {
  static async DeleteArticle(articleId: number): Promise<ArticleResponse> {
    // find article
    const article = await prismaClient.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article) throw new NotFoundError("Article is not found");

    // find all related article images
    const images = await prismaClient.imageArticle.findMany({
      where: {
        articleId: articleId,
      },
      select: {
        id: true,
        alt: true,
      },
    });

    const thumbnail_alt = article.thumbnail_alt;

    // ------ DELETING THUMBNAIL FROM INTERNAL STORAGE --------
    const currentDirectory: string = process.cwd();
    const fileDirectory: string = "/uploads/article";
    if (thumbnail_alt) {
      const thumbnailPath: string = path.join(
        currentDirectory,
        fileDirectory,
        "/thumbnails/",
        thumbnail_alt
      );
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    // ------ end of DELETING THUMBNAIL FROM INTERNAL STORAGE --------

    // ------ DELETING ALL IMAGES OF ARTICLE --------
    if (images) {
      images.forEach((image) => {
        const imagePath = path.join(
          currentDirectory,
          fileDirectory,
          "/images/",
          image.alt
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    // ------ end of DELETING ALL IMAGES OF ARTICLE --------

    // ====== DELETING ARTICLE AND ITS PROPERTIES FROM DATABASE ======
    const deleteArticleTransaction = await prismaClient.$transaction(
      async (prismaClient) => {
        await prismaClient.imageArticle.deleteMany({
          where: { articleId: articleId },
        });

        await prismaClient.textArticle.deleteMany({
          where: { articleId: articleId },
        });
        const deletedArticle = await prismaClient.article.delete({
          where: { id: articleId },
        });
        return deletedArticle;
      }
    );
    // ====== end of DELETING ARTICLE AND ITS PROPERTIES FROM DATABASE ======

    return toArticleResponse(deleteArticleTransaction);
  }
}
