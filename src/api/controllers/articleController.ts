import { NextFunction, Request, Response } from "express";
import { ArticleMulterRequest } from "../models/multerModel";
import { ArticleService } from "../services/article-service";
import { BadRequestError } from "../errors/BadRequestError";
import { Unauthenticated } from "../errors/Unauthenticated";
import { CustomRequest } from "../middlewares/auth";
export class articleController {
  static async create(
    request: ArticleMulterRequest,
    response: Response,
    next: NextFunction
  ) {
    const role = request.user?.role;
    if (role !== "writer") throw new Unauthenticated("You are not authorized");
    const createArticleResponse = await ArticleService.createArticle(request);
    response.status(201).json({
      success: true,
      data: createArticleResponse,
    });
  }

  static async getAllArticle(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    let { sort, search } = request.query;

    sort = (sort as string) || "recent";
    search = (search as string) || "";
    const pageStr: string | undefined =
      typeof request.query.page === "string" ? request.query.page : undefined;
    const takeStr: string | undefined =
      typeof request.query.take === "string" ? request.query.take : undefined;

    //---------- pagination --------------
    const page: number = pageStr ? parseInt(pageStr, 10) || 1 : 1;
    const take: number = takeStr ? parseInt(takeStr, 10) || 16 : 16;
    const skip: number = (page - 1) * take;
    //------------------------------------

    const getAllArticleResponse = await ArticleService.getAllArticle(
      take,
      skip,
      sort,
      search
    );

    response.status(200).json({
      success: true,
      data: getAllArticleResponse,
    });
  }

  static async getOneArticle(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { articleId } = request.params;
    if (isNaN(Number(articleId)))
      throw new BadRequestError("id must be number");
    const getOneArticleResponse = await ArticleService.getOneArticle(
      parseInt(articleId)
    );

    response.status(200).json({
      success: true,
      data: getOneArticleResponse,
    });
  }

  static async delete(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    const role = request.user?.role;
    if (role !== "writer") throw new Unauthenticated("You are not authorized");
    const { articleId } = request.params;
    if (isNaN(Number(articleId)))
      throw new BadRequestError("id must be number");

    const deleteArticleResponse = await ArticleService.deleteArticle(
      parseInt(articleId)
    );
    response.status(200).json({
      success: true,
      data: deleteArticleResponse,
    });
  }

  static async edit(
    request: ArticleMulterRequest,
    response: Response,
    next: NextFunction
  ) {
    const role = request.user?.role;
    if (role !== "writer") throw new Unauthenticated("You are not authorized");
    const editArticleResponse = await ArticleService.editArticle(request);

    response.status(200).json({
      success: true,
      data: editArticleResponse,
    });
  }
}
