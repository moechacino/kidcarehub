import { UserController } from "../../src/api/controllers/userController";
import { LogoutService } from "../../src/api/services/user-service/logoutService";

import { CustomRequest } from "../../src/api/middlewares/auth";

jest.mock("../../src/api/services/user-service/logoutService", () => ({
  LogoutService: {
    logout: jest.fn(),
  },
}));
describe("User Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should call UserService.logout and send success response", async () => {
    const mockRequest = { user: { _id: 123 } } as CustomRequest;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const mockNext = jest.fn();

    const mockLogoutUserResponse = { id: 123 };

    (LogoutService.logout as jest.Mock).mockResolvedValue(
      mockLogoutUserResponse
    );

    await UserController.logout(mockRequest, mockResponse, mockNext);

    expect(LogoutService.logout).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      data: mockLogoutUserResponse,
    });

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next function if LogoutService.logout throw an error", async () => {
    const mockRequest = { user: { _id: 123 } } as CustomRequest;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const mockNext = jest.fn();
    const errorMessage = "logout failed";

    (LogoutService.logout as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );
    await UserController.logout(mockRequest, mockResponse, mockNext);

    expect(LogoutService.logout).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
  });
});
