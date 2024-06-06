import { ArticleResponse } from "../../models/articleModels";
import { ArticleMulterRequest } from "../../models/multerModel";
import { CreateArticleService } from "./createArticleService";
import { DeleteArticleService } from "./deleteArticleService";
import { EditArticleService } from "./editArticleService";
import { GetArticleService } from "./getArticleService";

export class ArticleService {
  static async createArticle(
    request: ArticleMulterRequest
  ): Promise<ArticleResponse> {
    return CreateArticleService.createArticle(request);
  }

  static async deleteArticle(articleId: number): Promise<ArticleResponse> {
    return DeleteArticleService.DeleteArticle(articleId);
  }

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
    return GetArticleService.getAllArticle(take, skip, sort, search);
  }

  static async getOneArticle(articleId: number): Promise<ArticleResponse> {
    return GetArticleService.getOneArticle(articleId);
  }

  static async editArticle(
    request: ArticleMulterRequest
  ): Promise<ArticleResponse> {
    return EditArticleService.editArticle(request);
  }
}
