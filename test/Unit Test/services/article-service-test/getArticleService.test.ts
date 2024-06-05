import { NotFoundError } from "../../../../src/api/errors/NotFoundError";
import { ArticleService } from "../../../../src/api/services/article";
import { prismaClient } from "../../../../src/config/database";

jest.mock("../../../../src/config/database", () => ({
  prismaClient: {
    article: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("GetArticleService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllArticle", () => {
    it("should return articles with pagination", async () => {
      const take = 10;
      const skip = 0;
      const sort = "recent";
      const search = "test";

      const articles = [
        { id: 1, title: "Test Article", createdAt: new Date() },
        { id: 2, title: "Another Test Article", createdAt: new Date() },
      ];

      (prismaClient.article.findMany as jest.Mock).mockResolvedValue(articles);
      (prismaClient.article.count as jest.Mock).mockResolvedValue(20);

      const result = await ArticleService.getAllArticle(
        take,
        skip,
        sort,
        search
      );

      expect(prismaClient.article.findMany).toHaveBeenCalledWith({
        skip,
        take,
        where: { title: { contains: search } },
        orderBy: { createdAt: "desc" },
      });
      expect(prismaClient.article.count).toHaveBeenCalledWith({
        where: { title: { contains: search } },
      });

      expect(result).toEqual({
        articles,
        totalPage: 2,
        currentPage: 1,
      });
    });
  });

  describe("getOneArticle", () => {
    it("should return article by id", async () => {
      const articleId = 1;
      const article = {
        id: articleId,
        title: "Test Article",
        writerId: 1,
        thumbnail: "http://example.com/thumbnail.jpg",
        createdAt: new Date(),
        writer: { name: "John Doe" },
        imageArticle: [
          { id: 1, position: 2, url: "http://example.com/image.jpg" },
        ],
        textArticle: [{ id: 1, position: 1, text: "Test text" }],
      };

      (prismaClient.article.findUnique as jest.Mock).mockResolvedValue(article);

      const result = await ArticleService.getOneArticle(articleId);

      expect(prismaClient.article.findUnique).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          writerId: true,
          thumbnail: true,
          createdAt: true,
          writer: { select: { name: true } },
          imageArticle: { select: { id: true, position: true, url: true } },
          textArticle: { select: { id: true, position: true, text: true } },
        },
        where: { id: articleId },
      });

      expect(result).toEqual({
        id: article.id,
        title: article.title,
        thumbnailUrl: article.thumbnail,
        writer: article.writer.name,
        textsAndImagesData: [
          { id: 1, position: 1, text: "Test text" },
          {
            id: 1,
            position: 2,

            url: "http://example.com/image.jpg",
          },
        ],
        createdAt: article.createdAt,
      });
    });

    it("should throw NotFoundError if article does not exist", async () => {
      const articleId = 1;
      (prismaClient.article.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(ArticleService.getOneArticle(articleId)).rejects.toThrow(
        NotFoundError
      );

      expect(prismaClient.article.findUnique).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          writerId: true,
          thumbnail: true,
          createdAt: true,
          writer: { select: { name: true } },
          imageArticle: { select: { id: true, position: true, url: true } },
          textArticle: { select: { id: true, position: true, text: true } },
        },
        where: { id: articleId },
      });
    });
  });
});
