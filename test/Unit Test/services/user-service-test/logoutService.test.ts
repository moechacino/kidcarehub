import { CustomAPIError } from "../../../../src/api/errors/CustomAPIError";
import { Unauthenticated } from "../../../../src/api/errors/Unauthenticated";
import { CustomRequest } from "../../../../src/api/middlewares/auth";
import { toUserResponse } from "../../../../src/api/models/userModel";
import { LogoutService } from "../../../../src/api/services/user-service/logoutService";
import { prismaClient } from "../../../../src/config/database";

jest.mock("../../../../src/config/database", () => ({
  prismaClient: {
    user: {
      update: jest.fn(),
    },
  },
}));
jest.mock("../../../../src/api/models/userModel");

describe("Logout Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return user response", async () => {
    const mockUser = {
      _id: 123,
      name: "aksa",
      phoneNumber: "08123134707",
    };
    const _id = mockUser._id;
    const updatedUser = { id: 123, token: null };

    (prismaClient.user.update as jest.Mock).mockResolvedValue(updatedUser);
    (toUserResponse as jest.Mock).mockReturnValue({ id: 123 });

    const result = await LogoutService.logout(_id);

    expect(prismaClient.user.update).toHaveBeenCalledWith({
      where: { id: 123 },
      data: { token: null },
    });

    expect(toUserResponse).toHaveBeenCalledWith(updatedUser);
    expect(result).toEqual({ id: 123, token: null });
  });

  it("should throw CustomAPIError if prismaClient update fails", async () => {
    const mockUser = { _id: 123 };
    const _id = mockUser._id;
    const errorMessage = "Database error";

    (prismaClient.user.update as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await expect(LogoutService.logout(_id)).rejects.toThrow(
      new CustomAPIError(
        `Failed to logout user. Errors: Error: ${errorMessage}`,
        500
      )
    );
  });
});
