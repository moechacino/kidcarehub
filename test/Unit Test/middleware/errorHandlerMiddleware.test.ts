import { Request, Response, NextFunction } from "express";
import { CustomAPIError } from "../../../src/api/errors/CustomAPIError";
import { ZodError } from "zod";
import { errorHandlerMiddleware } from "../../../src/api/middlewares/errorHandler";

describe("errorHandlerMiddleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should handle ZodError and return 400 status", async () => {
    const zodError = new ZodError([]);

    await errorHandlerMiddleware(
      zodError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: `Validation Error : ${JSON.stringify(zodError)}`,
    });
  });

  it("should handle CustomAPIError and return the appropriate status code", async () => {
    const customError = new CustomAPIError("Custom API Error", 404);

    await errorHandlerMiddleware(
      customError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: "Custom API Error",
    });
  });

  it("should handle general errors and return 500 status", async () => {
    const generalError = new Error("General error");

    await errorHandlerMiddleware(
      generalError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(
      "Something went wrong please try again"
    );
  });
});
