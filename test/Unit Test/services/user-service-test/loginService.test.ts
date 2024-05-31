import { LoginUserRequest } from "../../../../src/api/models/userModel";
import { LoginService } from "../../../../src/api/services/user-service/loginService";
import { prismaClient } from "../../../../src/config/database";
import bcrypt from "bcrypt";
import { Validation } from "../../../../src/api/validations/validation";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../../../../src/api/errors/NotFoundError";
import { Unauthenticated } from "../../../../src/api/errors/Unauthenticated";
jest.mock("../../../../src/config/database", () => ({
  prismaClient: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../../../src/api/validations/validation");

describe("Login Service Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function getMockRequest(): LoginUserRequest {
    return {
      phoneNumber: "081234",
      password: "rahasia",
    } as LoginUserRequest;
  }

  function getMockData() {
    return {
      id: 1,
      name: "John Doe",
      phoneNumber: "081234",
      token: null,
    };
  }

  it("should login success", async () => {
    const mockRequest = getMockRequest();
    const mockUserData = getMockData();

    (Validation.validate as jest.Mock).mockReturnValue(mockRequest);
    (prismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce(
      mockUserData
    );

    (bcrypt.compare as jest.Mock).mockReturnValue(true);
    const token = jwt.sign(
      {
        _id: 1,
        name: "John Doe",
        phoneNumber: mockRequest.phoneNumber,
      },
      "Secret_Key",
      { expiresIn: "1000" }
    );

    (jwt.sign as jest.Mock).mockReturnValue(token);

    (prismaClient.user.update as jest.Mock).mockResolvedValue({
      ...mockUserData,
      ...{ token: token },
    });

    const result = await LoginService.login(mockRequest);

    expect(result).toEqual({
      id: 1,
      name: "John Doe",
      phoneNumber: mockRequest.phoneNumber,
      token: token,
    });
  });

  it("should login failed and throw NotFoundError", async () => {
    const mockRequest = getMockRequest();

    (Validation.validate as jest.Mock).mockReturnValue(mockRequest);
    (prismaClient.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(LoginService.login(mockRequest)).rejects.toThrow(
      NotFoundError
    );

    expect(prismaClient.user.update as jest.Mock).not.toHaveBeenCalled();
  });

  it("should login failed and throw Unauthenticated(phone number and password is wrong)", async () => {
    const mockRequest = getMockRequest();
    const mockUserData = getMockData();

    (Validation.validate as jest.Mock).mockReturnValue(mockRequest);
    (prismaClient.user.findUnique as jest.Mock).mockResolvedValueOnce(
      mockUserData
    );

    (bcrypt.compare as jest.Mock).mockReturnValue(false);

    await expect(LoginService.login(mockRequest)).rejects.toThrow(
      Unauthenticated
    );
    expect(prismaClient.user.update as jest.Mock).not.toHaveBeenCalled();
  });
});
