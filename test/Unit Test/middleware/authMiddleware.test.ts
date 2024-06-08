import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { Unauthenticated } from "../../../src/api/errors/Unauthenticated";
import {
  authenticationMiddleware,
  CustomRequest,
} from "../../../src/api/middlewares/auth";

jest.mock("jsonwebtoken");

describe("authentication Middleware Test", () => {
  let mockRequest: Partial<CustomRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should call next with Unauthenticated error if no token is provided", async () => {
    mockRequest.headers = {};

    await expect(
      authenticationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    ).rejects.toThrow(Unauthenticated);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next with Unauthenticated error if token is invalid", async () => {
    mockRequest.headers!.authorization = "Bearer invalid_token";

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new JsonWebTokenError("invalid token");
    });

    await expect(
      authenticationMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    ).rejects.toThrow(Unauthenticated);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next and set user in request if token is valid", async () => {
    const user = { _id: 123, name: "John Doe", phoneNumber: "1234567890" };
    const token = "valid_token";
    mockRequest.headers!.authorization = `Bearer ${token}`;

    (jwt.verify as jest.Mock).mockReturnValue(user);

    await authenticationMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      process.env.JWT_SECRET || "anjay secret"
    );
    expect((mockRequest as CustomRequest).user).toEqual(user);
    expect(mockNext).toHaveBeenCalled();
  });
});
