import { ConflictRequestError } from "../../../../src/api/errors/ConflictRequestError";
import { CreateUserRequest } from "../../../../src/api/models/userModel";
import { RegisterService } from "../../../../src/api/services/user-service/registerService";
import { Validation } from "../../../../src/api/validations/validation";
import { prismaClient } from "../../../../src/config/database";

import bcrypt from "bcrypt";

jest.mock("bcrypt");
jest.mock("../../../../src/api/validations/validation");
jest.mock("../../../../src/config/database", () => ({
  prismaClient: {
    user: {
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("register Service Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function getMockRequest(): CreateUserRequest {
    return {
      phone: "081234",
      name: "John Doe",
      password: "rahasia",
    } as CreateUserRequest;
  }

  it("should register success", async () => {
    const mockRequest = getMockRequest();
    (Validation.validate as jest.Mock).mockReturnValue(mockRequest);

    (prismaClient.user.count as jest.Mock).mockResolvedValue(0);

    (bcrypt.hash as jest.Mock).mockReturnValue("hashed password");

    (prismaClient.user.create as jest.Mock).mockResolvedValue({
      ...mockRequest,
      ...{ password: "hashed password" },
      ...{ id: 1 },
    });

    const result = await RegisterService.register(mockRequest);

    expect(result).toEqual({
      id: 1,
      phone: "081234",
      name: "John Doe",
    });
  });

  it("should register failed and throw ConflictRequestError(Phone number is already registered)", async () => {
    const mockRequest = getMockRequest();
    (Validation.validate as jest.Mock).mockReturnValue(mockRequest);

    (prismaClient.user.count as jest.Mock).mockResolvedValue(1);

    await expect(RegisterService.register(mockRequest)).rejects.toThrow(
      ConflictRequestError
    );

    expect(prismaClient.user.create).not.toHaveBeenCalled();
  });
});
