import { prismaClient } from "../../../config/database";
import { NotFoundError } from "../../errors/NotFoundError";
import { ArticleResponse, toArticleResponse } from "../../models/articleModels";
import { articleCombineData } from "../../utils/articleCombineData";

export class GetArticleService {
  static async getAllArticle(
    take: number,
    skip: number,
    sort: string,
    search?: string
  ): Promise<{
    articles: object[];
    totalPage: number;
    currentPage: number;
  }> {
    const whereObject = search
      ? {
          title: {
            contains: search,
          },
        }
      : {};

    const queryObject: {
      skip: number;
      take: number;
      where: object;
      orderBy?: object;
    } = {
      skip: skip,
      take: take,
      where: whereObject,
    };

    queryObject.orderBy =
      sort === "recent"
        ? { createdAt: "desc" }
        : sort === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" };

    const articles: object[] = await prismaClient.article.findMany(queryObject);
    const totalArticle = await prismaClient.article.count({
      where: whereObject,
    });
    const totalPage: number = Math.ceil(totalArticle / take);
    const currentPage: number = skip / take + 1;

    return {
      articles: articles,
      totalPage: totalPage,
      currentPage: currentPage,
    };
  }

  static async getOneArticle(articleId: number): Promise<ArticleResponse> {
    const article = await prismaClient.article.findUnique({
      select: {
        id: true,
        title: true,
        writerId: true,
        thumbnail: true,
        createdAt: true,
        writer: {
          select: {
            name: true,
          },
        },
        imageArticle: {
          select: {
            id: true,
            position: true,
            url: true,
          },
        },
        textArticle: {
          select: {
            id: true,
            position: true,
            text: true,
          },
        },
      },
      where: { id: articleId },
    });

    if (!article)
      throw new NotFoundError(`article with an ${articleId} is not found`);

    const { imageArticle, textArticle } = article;
    const data = articleCombineData(imageArticle, textArticle);
    const response: ArticleResponse = {
      id: article.id,
      title: article.title,
      thumbnailUrl: article.thumbnail,
      writer: article.writer.name,
      textsAndImagesData: data,
      createdAt: article.createdAt,
    };

    return response;
  }
}
