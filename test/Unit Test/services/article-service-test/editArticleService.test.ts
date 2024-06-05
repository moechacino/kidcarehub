import { ArticleMulterRequest } from "../../../../src/api/models/multerModel";
import { ArticleService } from "../../../../src/api/services/article";
import { Validation } from "../../../../src/api/validations/validation";
import { prismaClient } from "../../../../src/config/database";
import { Request, Response, NextFunction } from "express";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
jest.mock("fs");
jest.mock("path");
jest.mock("../../../../src/config/database", () => ({
  prismaClient: {
    $transaction: jest.fn(),
    article: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    textArticle: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    imageArticle: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock("../../../../src/api/validations/validation"); //mock validation

describe("editArticleService Test", () => {
  let mockRequest: Partial<ArticleMulterRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  beforeEach(() => {
    jest.clearAllMocks();
    (prismaClient.$transaction as jest.Mock).mockImplementation(
      async (transactionFn) => {
        return transactionFn(prismaClient);
      }
    );
    mockRequest = {
      params: {
        articleId: "1",
      },
      body: {
        title: "new Title",
        texts: JSON.stringify([
          { id: 1, position: 1, text: "First Text" },
          { id: 2, position: 3, text: "Second Text" },
          { position: 5, text: "Third Text" },
        ]),
        images: JSON.stringify([
          { id: 1, position: 2, url: "//image1.jpg", alt: "image1.jpg" },
          { id: 2, position: 4, url: "//image2.jpg", alt: "image2.jpg" },
        ]),
      },
      files: {
        thumbnail: [
          {
            filename: "Newthumbnail.jpg",
            fieldname: "thumbnail",
            originalname: "",
            encoding: "",
            mimetype: "",
            size: 0,
            stream: new Readable(),
            destination: "",
            path: "",
            buffer: Buffer.from("example"),
          },
        ],
        newImage: [
          {
            filename: "image3.jpg",
            fieldname: "newImage",
            originalname: "",
            encoding: "",
            mimetype: "",
            size: 0,
            stream: new Readable(),
            destination: "",
            path: "",
            buffer: Buffer.from("example"),
          },
          {
            filename: "image4.jpg",
            fieldname: "newImage",
            originalname: "",
            encoding: "",
            mimetype: "",
            size: 0,
            stream: new Readable(),
            destination: "",
            path: "",
            buffer: Buffer.from("example"),
          },
        ],
      },
    };
  });

  it("should edit article success with NEW Image", async () => {
    (Validation.validate as jest.Mock).mockReturnValueOnce({
      articleId: 1,
      title: mockRequest.body.title,
      textArticle: mockRequest.body.texts,
      imageArticle: mockRequest.body.images,
    });

    (prismaClient.article.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
      thumbnail_alt: "OldThumbnail.jpg",
    });

    const currentDirectory: string = "/current/dir/mock/";
    const fileDirectory: string = "/uploads/article";
    const thumbnailPath: string = path.join(
      currentDirectory,
      fileDirectory,
      "/thumbnails/",
      "OldThumbnail.jpg"
    );

    jest.spyOn(process, "cwd").mockReturnValue(currentDirectory);
    jest.spyOn(fs, "unlinkSync").mockReturnValue(undefined);

    // mock update data text
    (prismaClient.textArticle.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 1,
      text: "text 1",
    });
    (prismaClient.textArticle.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 2,
      text: "text 2",
    });

    (prismaClient.textArticle.update as jest.Mock).mockResolvedValueOnce({
      id: 1,
      text: "First Text",
    });

    (prismaClient.textArticle.update as jest.Mock).mockResolvedValueOnce({
      id: 2,
      text: "Second Text",
    });

    (prismaClient.textArticle.create as jest.Mock).mockResolvedValueOnce({
      id: 3,
      text: "Third Text",
    });
    // mock update data text END

    // mock update data images

    (prismaClient.imageArticle.update as jest.Mock).mockResolvedValueOnce(
      JSON.parse(mockRequest.body.images)[0]
    );
    (prismaClient.imageArticle.update as jest.Mock).mockResolvedValueOnce(
      JSON.parse(mockRequest.body.images)[1]
    );

    // mock update data images END

    // mock add new images
    (prismaClient.imageArticle.create as jest.Mock).mockResolvedValueOnce({
      id: 3,
      position: 5,
      url: "//image3.jpg",
      alt: "image3.jpg",
    });
    (prismaClient.imageArticle.create as jest.Mock).mockResolvedValueOnce({
      id: 4,
      position: 6,
      url: "//image4.jpg",
      alt: "image4.jpg",
    });

    // mock add new images END
    const deletedUnusedArticleData = jest.fn();
    deletedUnusedArticleData.mockResolvedValue(true);

    (prismaClient.article.update as jest.Mock).mockResolvedValue({
      id: 1,
      title: "new Title",
      thumbnail: "//Newthumbnail.jpg",
      thumbnail_alt: "Newthumbnail.jpg",
    });

    const result = await ArticleService.editArticle(
      mockRequest as ArticleMulterRequest
    );
    console.log(result);
    expect(prismaClient.article.update).toHaveBeenCalled();
  });
});
