// verifyToken.test.js

import { Unauthenticated } from "../../../src/api/errors/Unauthenticated";
import { verifyToken } from "../../../src/api/middlewares/verifyToken";
import { prismaClient } from "../../../src/config/database";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./../../../src/api/middlewares/auth";
jest.mock("../../../src/config/database", () => ({
  prismaClient: {
    user: {
      findUnique: jest.fn(),
    },
    writer: {
      findUnique: jest.fn(),
    },
    admin: {
      findUnique: jest.fn(),
    },
  },
}));
describe("verifyToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if token is valid", async () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer ValidToken",
      },
      user: {
        _id: 1,
        phone: "0123",
        role: "user",
      },
    } as CustomRequest;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    const mockUser = {
      id: 1,
      token: "ValidToken",
    };

    (prismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);

    await verifyToken(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("should throw Unauthenticated error if token is expired", async () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer ExpiredToken",
      },
      user: {
        _id: 1,
        phone: "0123",
        role: "user",
      },
    } as CustomRequest;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    const mockUser = {
      id: "userId",
      token: "validToken",
    };

    (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      verifyToken(mockRequest, mockResponse, mockNext)
    ).rejects.toThrow(
      new Unauthenticated("Your Access Token is Expired. Please Login Again")
    );

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should throw Unauthenticated error if no access", async () => {
    const mockRequest = {
      headers: {
        authorization: "Bearer 30912",
      },
      user: {
        _id: 1,
        phone: "0123",
        role: "user",
      },
    } as CustomRequest;
    const mockResponse = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    const mockUser = {};

    (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      verifyToken(mockRequest, mockResponse, mockNext)
    ).rejects.toThrow(new Unauthenticated("No access"));

    expect(mockNext).not.toHaveBeenCalled();
  });
});
