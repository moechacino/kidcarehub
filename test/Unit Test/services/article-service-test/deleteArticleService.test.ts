import fs from "fs";
import path from "path";
import { NotFoundError } from "../../../../src/api/errors/NotFoundError";
import { prismaClient } from "../../../../src/config/database";
import { ArticleService } from "../../../../src/api/services/article";
import { toArticleResponse } from "../../../../src/api/models/articleModels";

jest.mock("fs");
jest.mock("path");
jest.mock("../../../../src/api/models/articleModels");
jest.mock("../../../../src/config/database", () => ({
  prismaClient: {
    article: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    imageArticle: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    textArticle: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

(prismaClient.$transaction as jest.Mock).mockImplementation(
  async (transactionFn) => {
    return transactionFn(prismaClient);
  }
);
describe("DeleteArticleService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete the article and its related images from database and storage", async () => {
    const articleId = 1;
    const article = {
      id: articleId,
      thumbnail_alt: "thumbnail.jpg",
    };
    const images = [
      { id: 1, alt: "image1.jpg" },
      { id: 2, alt: "image2.jpg" },
    ];

    (prismaClient.article.findUnique as jest.Mock).mockResolvedValue(article);
    (prismaClient.imageArticle.findMany as jest.Mock).mockResolvedValue(images);
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    (prismaClient.imageArticle.deleteMany as jest.Mock).mockResolvedValue([]);
    (prismaClient.textArticle.deleteMany as jest.Mock).mockResolvedValue([]);
    (prismaClient.article.delete as jest.Mock).mockResolvedValue({
      id: 1,
    });
    (toArticleResponse as jest.Mock).mockReturnValue({
      id: 1,
    });
    await ArticleService.deleteArticle(articleId);

    expect(prismaClient.article.findUnique).toHaveBeenCalledWith({
      where: { id: articleId },
    });
    expect(prismaClient.imageArticle.findMany).toHaveBeenCalledWith({
      where: { articleId: articleId },
      select: { id: true, alt: true },
    });

    images.forEach((image) => {
      const imagePath = path.join(
        process.cwd(),
        "/uploads/article/images/",
        image.alt
      );
      expect(fs.existsSync).toHaveBeenCalledWith(imagePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(imagePath);
    });

    const thumbnailPath = path.join(
      process.cwd(),
      "/uploads/article/thumbnails/",
      article.thumbnail_alt
    );
    expect(fs.existsSync).toHaveBeenCalledWith(thumbnailPath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(thumbnailPath);

    expect(prismaClient.$transaction).toHaveBeenCalled();

    expect(prismaClient.imageArticle.deleteMany).toHaveBeenCalledWith({
      where: { articleId: articleId },
    });
    expect(prismaClient.textArticle.deleteMany).toHaveBeenCalledWith({
      where: { articleId: articleId },
    });
    expect(prismaClient.article.delete).toHaveBeenCalledWith({
      where: { id: articleId },
    });
  });

  it("should throw NotFoundError if article does not exist", async () => {
    const articleId = 1;
    (prismaClient.article.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(ArticleService.deleteArticle(articleId)).rejects.toThrow(
      NotFoundError
    );

    expect(prismaClient.article.findUnique).toHaveBeenCalledWith({
      where: { id: articleId },
    });
    expect(prismaClient.imageArticle.findMany).not.toHaveBeenCalled();
    expect(fs.existsSync).not.toHaveBeenCalled();
    expect(fs.unlinkSync).not.toHaveBeenCalled();
    expect(prismaClient.$transaction).not.toHaveBeenCalled();
  });
});
