import { ArticleMulterRequest } from "../../../../src/api/models/multerModel";
import { Readable } from "stream";
import { ArticleService } from "../../../../src/api/services/article-service";
import { toArticleResponse } from "../../../../src/api/models/articleModels";
import { findMissingNumbersInArray } from "../../../../src/api/utils/findMissingNumbersInArray";
import { articleJsonParseUtils } from "../../../../src/api/utils/articleJsonParseUtils";
import { ArticleValidation } from "../../../../src/api/validations/articleValidation";
import { Validation } from "../../../../src/api/validations/validation";
import { prismaClient } from "../../../../src/config/database";
import { Unauthenticated } from "../../../../src/api/errors/Unauthenticated";

jest.mock("../../../../src/config/database", () => ({
  prismaClient: {
    article: {
      create: jest.fn(),
    },
    textArticle: {
      createMany: jest.fn(),
    },
    imageArticle: {
      createMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("../../../../src/api/validations/validation");
jest.mock("../../../../src/api/utils/articleJsonParseUtils");
jest.mock("../../../../src/api/utils/findMissingNumbersInArray");
jest.mock("../../../../src/api/models/articleModels");

describe("CreateArticle Service Test", () => {
  let mockRequest: Partial<ArticleMulterRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      user: {
        _id: 1,
        name: "John Doe",
        phoneNumber: "081234",
        role: "writer",
      },
      body: {
        title: "Test Article",
        textArticle: JSON.stringify([
          { position: 1, text: "First Text" },
          { position: 2, text: "Second Text" },
        ]),
      },
      files: {
        thumbnail: [
          {
            filename: "thumbnail.jpg",
            fieldname: "thumbnail",
            originalname: "",
            encoding: "",
            mimetype: "",
            size: 0,
            stream: new Readable(),
            destination: "",
            path: "",
            buffer: Buffer.from("Hello, World!"),
          },
        ],
        image: [
          {
            filename: "image1.jpg",
            fieldname: "",
            originalname: "",
            encoding: "",
            mimetype: "",
            size: 0,
            stream: new Readable(),
            destination: "",
            path: "",
            buffer: Buffer.from("Hello, World!"),
          },
          {
            filename: "image2.jpg",
            fieldname: "",
            originalname: "",
            encoding: "",
            mimetype: "",
            size: 0,
            stream: new Readable(),
            destination: "",
            path: "",
            buffer: Buffer.from("Hello, World!"),
          },
        ],
      },
    };

    (Validation.validate as jest.Mock).mockReturnValue({
      id: 1,
      title: "Test Article",
      thumbnail: "http://example.com/thumbnail.jpg",
      thumbnail_alt: "thumbnail.jpg",
    });

    (articleJsonParseUtils as jest.Mock).mockReturnValue([
      { position: 1, text: "First Text" },
      { position: 2, text: "Second Text" },
    ]);

    (findMissingNumbersInArray as jest.Mock).mockReturnValue({
      missingPosition: [3, 4],
      maxNumber: 2,
      count: 2,
    });

    (toArticleResponse as jest.Mock).mockReturnValue({
      id: 1,
      title: "Test Article",
      thumbnailUrl: "http://example.com/thumbnail.jpg",
      textArticle: [
        { position: 1, text: "First Text" },
        { position: 2, text: "Second Text" },
      ],
      imageArticle: [
        {
          position: 3,
          url: "http://example.com/image1.jpg",
          alt: "image1.jpg",
        },
        {
          position: 4,
          url: "http://example.com/image2.jpg",
          alt: "image2.jpg",
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  (prismaClient.$transaction as jest.Mock).mockImplementation(
    async (transactionFn) => {
      return transactionFn(prismaClient);
    }
  );
  it("should create an article successfully", async () => {
    const resolvedValueCreateArticle = {
      id: 1,
      title: "Test Article",
      thumbnail: "http://example.com/thumbnail.jpg",
      thumbnail_alt: "thumbnail.jpg",
    };
    (prismaClient.article.create as jest.Mock).mockResolvedValueOnce(
      resolvedValueCreateArticle
    );

    (prismaClient.textArticle.createMany as jest.Mock).mockResolvedValue([]);
    (prismaClient.imageArticle.createMany as jest.Mock).mockResolvedValue([]);

    const response = await ArticleService.createArticle(
      mockRequest as ArticleMulterRequest
    );

    expect(Validation.validate).toHaveBeenCalledWith(ArticleValidation.CREATE, {
      title: "Test Article",
      thumbnail: "http://example.com/thumbnail.jpg",
      textArticle: JSON.stringify([
        { position: 1, text: "First Text" },
        { position: 2, text: "Second Text" },
      ]),
    });

    expect(prismaClient.$transaction).toHaveBeenCalled();
    expect(toArticleResponse).toHaveBeenCalled();

    expect(response).toEqual({
      id: 1,
      title: "Test Article",
      thumbnailUrl: "http://example.com/thumbnail.jpg",
      textArticle: [
        { position: 1, text: "First Text" },
        { position: 2, text: "Second Text" },
      ],
      imageArticle: [
        {
          position: 3,
          url: "http://example.com/image1.jpg",
          alt: "image1.jpg",
        },
        {
          position: 4,
          url: "http://example.com/image2.jpg",
          alt: "image2.jpg",
        },
      ],
    });
  });

  it("should throw Unauthenticated error if user is not authorized", async () => {
    mockRequest.user = undefined;

    await expect(
      ArticleService.createArticle(mockRequest as ArticleMulterRequest)
    ).rejects.toThrow(Unauthenticated);
  });
});
