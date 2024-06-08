import { prismaClient } from "../../../config/database";
import { Unauthenticated } from "../../errors/Unauthenticated";

import {
  ArticleImage,
  ArticleResponse,
  CreateArticleRequest,
  toArticleResponse,
} from "../../models/articleModels";

import { findMissingNumbersInArray } from "../../utils/findMissingNumbersInArray";
import { ArticleValidation } from "../../validations/articleValidation";
import { Validation } from "../../validations/validation";
import { articleJsonParseUtils } from "../../utils/articleJsonParseUtils";
import { ArticleMulterRequest } from "../../models/multerModel";
import { BadRequestError } from "../../errors/BadRequestError";

export class CreateArticleService {
  static async createArticle(
    request: ArticleMulterRequest
  ): Promise<ArticleResponse> {
    // --------- VALIDATION -----------
    if (!request.user) throw new Unauthenticated("You are not authorized");

    const writerId = request.user!._id;
    if (!writerId || request.user!.role !== "writer")
      throw new Unauthenticated("You are not authorized");

    const bodyRequest: CreateArticleRequest =
      request.body as CreateArticleRequest;

    const { thumbnail, image } = (request.files || {}) as {
      [fieldname: string]: Express.Multer.File[];
    };
    if (!thumbnail) throw new BadRequestError("upload thumbnail please");

    const thumbnail_alt = thumbnail[0].filename;
    console.log(thumbnail_alt);
    const thumbnailUrl = `http://example.com/${thumbnail_alt}`;

    const rawData = {
      title: bodyRequest.title,
      textArticle: bodyRequest.textArticle,
    };
    const data = Validation.validate(ArticleValidation.CREATE, rawData);
    // --------- end of VALIDATION -----------

    // parsing TEXT
    const parsedTexts = articleJsonParseUtils(data.textArticle);

    // ---- getting list of text position ----
    const listTextPosition: number[] = [];
    parsedTexts.forEach((e) => {
      listTextPosition.push(e.position);
    });
    // ---- end of getting list of text position ----

    // find empty position in list of text position
    const { missingPosition, maxNumber, count } =
      findMissingNumbersInArray(listTextPosition);

    // ------- PROCESSING IMAGE DATA -----------
    let imageData: ArticleImage[] = [];
    if (image) {
      // if image.length more than count of empty position gotten from list of text position
      if (image.length > count) {
        for (let i = 0; i < image.length; i++) {
          const filename = image[i].filename.replace(/\s+/g, "-");
          const imagePath = `http://example.com/${filename}`;
          if (i >= count) {
            imageData.push({
              position: maxNumber + (i + 1 - count),
              url: imagePath,
              alt: filename,
            });
          } else {
            imageData.push({
              position: missingPosition[i],
              url: imagePath,
              alt: filename,
            });
          }
        }
      } else if (image.length <= count) {
        for (let i = 0; i < image.length; i++) {
          const filename = image[i].filename.replace(/\s+/g, "-");
          const imagePath = `http://example.com/${filename}`;
          imageData.push({
            position: missingPosition[i],
            url: imagePath,
            alt: filename,
          });
        }
      }
    }
    // ------- end of PROCESSING IMAGE DATA -----------

    // -------- TRANSACTION CREATING AN ARTICLE -----------
    const createArticleTransaction = await prismaClient.$transaction(
      async (prismaClient) => {
        const article = await prismaClient.article.create({
          data: {
            writer: { connect: { id: writerId } },
            title: data.title,
            thumbnail: thumbnailUrl,
            thumbnail_alt: thumbnail_alt,
          },
        });

        const newTexts = await prismaClient.textArticle.createMany({
          data: parsedTexts.map((data) => ({
            text: data.text!,
            position: data.position,
            articleId: article.id,
          })),
        });

        if (image) {
          const newImages = await prismaClient.imageArticle.createMany({
            data: imageData.map((data) => ({
              articleId: article.id,
              position: data.position,
              url: data.url,
              alt: data.alt,
            })),
          });
        }
        return article;
      }
    );
    // -------- end of TRANSACTION CREATING AN ARTICLE -----------

    return toArticleResponse(createArticleTransaction);
  }
}
