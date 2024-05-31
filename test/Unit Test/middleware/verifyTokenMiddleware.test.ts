import { Request, Response, NextFunction } from "express";
import { Unauthenticated } from "../../../src/api/errors/Unauthenticated";
import { CustomRequest } from "../../../src/api/middlewares/auth";
import { verifyToken } from "../../../src/api/middlewares/verifyToken";
import { prismaClient } from "../../../src/config/database";

jest.mock("../../../src/config/database", () => ({
  prismaClient: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
describe("verifyToken", () => {
  let mockRequest: Partial<CustomRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: {
        authorization: "Bearer valid_token",
      },
      user: {
        _id: 1,
        phoneNumber: "081234",
        name: "John DOe",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should call next if token is valid", async () => {
    const user = {
      id: 1,
      token: "valid_token",
    };

    (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(user);

    await verifyToken(
      mockRequest as CustomRequest,
      mockResponse as Response,
      mockNext
    );

    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockRequest.user?._id },
    });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should throw Unauthenticated error if token is expired", async () => {
    const user = {
      id: 1,
      token: "expired_token",
    };

    (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(user);

    await expect(
      verifyToken(
        mockRequest as CustomRequest,
        mockResponse as Response,
        mockNext
      )
    ).rejects.toThrow(
      new Unauthenticated("Your Access Token is Expired. Please Login Again")
    );

    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockRequest.user?._id },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should throw Unauthenticated error if user is not found", async () => {
    (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      verifyToken(
        mockRequest as CustomRequest,
        mockResponse as Response,
        mockNext
      )
    ).rejects.toThrow(new Unauthenticated("No access"));

    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockRequest.user?._id },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
