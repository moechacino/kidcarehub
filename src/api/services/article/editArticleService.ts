import { prismaClient } from "../../../config/database";
import { NotFoundError } from "../../errors/NotFoundError";
import {
  ArticleResponse,
  ImageOrTextArticle,
  toArticleResponse,
} from "../../models/articleModels";
import { ArticleMulterRequest } from "../../models/multerModel";
import { articleJsonParseUtils } from "../../utils/articleJsonParseUtils";
import { ArticleValidation } from "../../validations/articleValidation";
import { Validation } from "../../validations/validation";
import { articleCombineData } from "../../utils/articleCombineData";
import { findMissingNumbersInArray } from "../../utils/findMissingNumbersInArray";
import path from "path";
import fs from "fs";

class EditArticleServiceUtils {
  static async updateDataText(
    arrText: ImageOrTextArticle[],
    articleId: number
  ): Promise<ImageOrTextArticle[]> {
    let newTexts: ImageOrTextArticle[] = [];
    const updateDataTextTransaction = await prismaClient.$transaction(
      async (prismaClient) => {
        for (const val of arrText) {
          if (val.id) {
            const text = await prismaClient.textArticle.findUnique({
              where: { id: val.id },
            });
            if (text) {
              const updatedText = await prismaClient.textArticle.update({
                where: { id: text.id },
                data: {
                  position: val.position,
                  text: val.text!,
                },
                select: {
                  id: true,
                  position: true,
                  text: true,
                },
              });

              newTexts.push(updatedText);
            } else {
              const newText = await prismaClient.textArticle.create({
                data: {
                  position: val.position,
                  text: val.text!,
                  article: { connect: { id: articleId } },
                },
                select: {
                  id: true,
                  text: true,
                  position: true,
                },
              });

              newTexts.push(newText);
            }
          }
        }

        return newTexts;
      }
    );
    return updateDataTextTransaction;
  }

  static async updateExistingImages(
    arrImage: ImageOrTextArticle[]
  ): Promise<ImageOrTextArticle[]> {
    let updatedExistingImages: ImageOrTextArticle[] = [];
    const updateExistingImagesTransaction = await prismaClient.$transaction(
      async (prismaClient) => {
        for (const val of arrImage) {
          const updatedImage = await prismaClient.imageArticle.update({
            where: { id: val.id },
            data: {
              position: val.position,
            },
            select: {
              id: true,
              position: true,
              url: true,
              alt: true,
            },
          });
          updatedExistingImages.push(updatedImage);
        }
        return updatedExistingImages;
      }
    );
    return updateExistingImagesTransaction;
  }

  static async addNewImages(
    images: Express.Multer.File[],
    articleId: number,
    missingPosition: number[],
    maxNumber: number,
    count: number
  ): Promise<ImageOrTextArticle[]> {
    let imageData: ImageOrTextArticle[] = [];
    let returnedImageData: ImageOrTextArticle[] = [];
    if (images.length > count) {
      for (let i = 0; i < images.length; i++) {
        const currentImage = images[i];
        const { filename } = currentImage;
        if (i >= count) {
          imageData.push({
            position: maxNumber + (i + 1 - count),
            url: `http://example/${filename}`,
            alt: filename,
          });
        } else {
          imageData.push({
            position: missingPosition[i],
            url: `http://example/${filename}`,
            alt: filename,
          });
        }
      }
    } else {
      for (let i = 0; i < images.length; i++) {
        const currentImage = images[i];
        const { filename } = currentImage;
        imageData.push({
          position: missingPosition[i],
          url: `http://example/${filename}`,
          alt: filename,
        });
      }
    }

    const addNewImagesTransaction = await prismaClient.$transaction(
      async (prismaClient) => {
        await Promise.all(
          imageData.map(async (val) => {
            const addedImage = await prismaClient.imageArticle.create({
              data: {
                position: val.position,
                url: val.url!,
                alt: val.alt!,
                article: { connect: { id: articleId } },
              },
              select: {
                id: true,
                position: true,
                url: true,
                alt: true,
              },
            });

            returnedImageData.push(addedImage);
          })
        );
        return returnedImageData;
      }
    );

    return addNewImagesTransaction;
  }

  static async deletedUnusedArticleData(
    articleId: number,
    data: ImageOrTextArticle[],
    indicator: string
  ): Promise<void> {
    if (data.length === 0) {
      if (indicator === "image") {
        // -------- DELETING IMAGE FROM INTERNAL STORAGE ---------
        const images = await prismaClient.imageArticle.findMany({
          where: { articleId: articleId },
          select: {
            id: true,
            alt: true,
          },
        });

        const currentDirectory = process.cwd();
        const fileDirectory = "/uploads/article";
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
          // -------- end of DELETING IMAGE FROM INTERNAL STORAGE ---------
          // DELETING IMAGE FROM DATABASE
          const deleteAllData = await prismaClient.imageArticle.deleteMany({
            where: {
              articleId: articleId,
            },
          });
        }
      } else if (indicator === "text") {
        const deleteAllData = await prismaClient.textArticle.deleteMany({
          where: { articleId: articleId },
        });
      }
      return;
    } else {
      if (indicator === "text") {
        const oldData = await prismaClient.textArticle.findMany({
          where: { articleId: articleId },
        });

        if (oldData) {
          for (const val of oldData) {
            if (data.some((obj) => obj.id === val.id)) {
              continue;
            } else if (data.some((obj) => obj.id !== val.id)) {
              const deletedTextData = await prismaClient.textArticle.delete({
                where: { id: val.id },
              });
            }
          }
        }
      } else if (indicator === "image") {
        const oldData = await prismaClient.imageArticle.findMany({
          where: { articleId: articleId },
        });

        if (oldData) {
          for (const val of oldData) {
            if (data.some((obj) => obj.id === val.id)) {
              continue;
            } else if (data.some((obj) => obj.id !== val.id)) {
              const deletedData = await prismaClient.imageArticle.delete({
                where: { id: val.id },
                select: {
                  id: true,
                  alt: true,
                },
              });

              const currentDirectory = process.cwd();
              const fileDirectory = "/uploads/article";
              const imagePath = path.join(
                currentDirectory,
                fileDirectory,
                "/images/",
                deletedData.alt
              );
              if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
              }
            }
          }
        }
      }

      return;
    }
  }
}

export class EditArticleService {
  static async editArticle(
    request: ArticleMulterRequest
  ): Promise<ArticleResponse> {
    // --------- VALIDATION ----------
    const { articleId } = request.params;
    const { title, texts, images } = request.body;

    const rawRequest = {
      articleId,
      title,
      textArticle: texts,
      imageArticle: images,
    };

    const validatedRequest = Validation.validate(
      ArticleValidation.EDIT,
      rawRequest
    );

    const { thumbnail, newImage } = request.files!;

    // --------- end of VALIDATION ----------

    // ----- CHECK IS ARTICLE EXIST
    const article = await prismaClient.article.findUnique({
      where: { id: parseInt(validatedRequest.articleId) },
      select: {
        id: true,
        thumbnail_alt: true,
      },
    });
    if (!article)
      throw new NotFoundError(`article with an id ${articleId} is not found`);
    // -----end CHECK

    // ----- PARSING TEXTS AND IMAGES DATA ---------
    const arrTexts: ImageOrTextArticle[] = articleJsonParseUtils(
      validatedRequest.textArticle
    );

    const arrImage: ImageOrTextArticle[] = validatedRequest.imageArticle
      ? articleJsonParseUtils(validatedRequest.imageArticle)
      : [];
    // ----- end of PARSING TEXTS AND IMAGES DATA ---------

    const updateArticleObject: {
      title: string;
      thumbnail?: string;
      thumbnail_alt?: string;
    } = {
      title: title,
    };

    // --------- UPDATE NEW THUMBNAIL IF EXIST
    if (thumbnail) {
      // --------- DELETING OLD THUMBNAIL FROM INTERNAL STORAGE -----
      const currentDirectory: string = process.cwd();
      const fileDirectory: string = "/uploads/article";
      if (article.thumbnail_alt) {
        const thumbnailPath: string = path.join(
          currentDirectory,
          fileDirectory,
          "/thumbnails/",
          article.thumbnail_alt
        );
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
      // --------- end of DELETING OLD THUMBNAIL FROM INTERNAL STORAGE -----
      //  update thumbnail data
      const newThumbnail_alt = thumbnail[0].filename;
      const newThumbnailUrl = `http://example.com/${newThumbnail_alt}`;
      updateArticleObject.thumbnail = newThumbnailUrl;
      updateArticleObject.thumbnail_alt = newThumbnail_alt;
    }
    // --------- end of UPDATE NEW THUMBNAIL IF EXIST

    // ------ GETTING EMPTY POSITION -----
    const textsAndImagesData = articleCombineData(arrTexts, arrImage);
    const listPosition: number[] = [];
    textsAndImagesData.forEach(function (data) {
      listPosition.push(data.position);
    });
    const { maxNumber, missingPosition, count } =
      findMissingNumbersInArray(listPosition);
    // ------ end of GETTING EMPTY POSITION -----

    const updatedTexts: ImageOrTextArticle[] =
      await EditArticleServiceUtils.updateDataText(
        arrTexts,
        parseInt(articleId)
      );
    let updatedImage: ImageOrTextArticle[] = images
      ? await EditArticleServiceUtils.updateExistingImages(arrImage)
      : [];

    if (newImage) {
      const addedNewImage = await EditArticleServiceUtils.addNewImages(
        newImage,
        parseInt(articleId),
        missingPosition,
        maxNumber,
        count
      );
      const allImageData = updatedImage.concat(addedNewImage);

      await EditArticleServiceUtils.deletedUnusedArticleData(
        parseInt(articleId),
        allImageData,
        "image"
      );
    } else {
      await EditArticleServiceUtils.deletedUnusedArticleData(
        parseInt(articleId),
        updatedImage,
        "image"
      );
    }

    await EditArticleServiceUtils.deletedUnusedArticleData(
      parseInt(articleId),
      updatedTexts,
      "text"
    );

    const updatedArticle = await prismaClient.article.update({
      where: { id: parseInt(articleId) },
      data: updateArticleObject,
    });

    return toArticleResponse(updatedArticle);
  }
}
