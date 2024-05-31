import { Request, Response, NextFunction } from "express";
import {
  CreateUserRequest,
  LoginUserRequest,
  UserResponse,
} from "../../../../src/api/models/userModel";
import { UserService } from "../../../../src/api/services/user-service";
import { UserController } from "../../../../src/api/controllers/userController";
import { CustomRequest } from "../../../../src/api/middlewares/auth";

jest.mock("../../../../src/api/services/user-service");
describe("UserController Test", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register user", () => {
    it("should register a user and return 201 status", async () => {
      const createUserRequest: CreateUserRequest = {
        name: "John Doe",
        phoneNumber: "081234",
        password: "password123",
      };

      const createUserResponse: UserResponse = {
        id: 1,
        name: "John Doe",
        phoneNumber: "081234",
      };

      mockRequest.body = createUserRequest;

      (UserService.register as jest.Mock).mockResolvedValue(createUserResponse);

      await UserController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(UserService.register).toHaveBeenCalledWith(createUserRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: createUserResponse,
      });
    });

    it("should call next with error if registration fails", async () => {
      const createUserRequest: CreateUserRequest = {
        name: "John Doe",
        phoneNumber: "081234",
        password: "password123",
      };

      const error = new Error("Registration failed");

      mockRequest.body = createUserRequest;

      (UserService.register as jest.Mock).mockRejectedValue(error);

      await UserController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("login user", () => {
    it("should login a user and return 200 status", async () => {
      const loginUserRequest: LoginUserRequest = {
        phoneNumber: "081234",
        password: "password123",
      };

      const loginUserResponse: UserResponse = {
        id: 1,
        name: "John Doe",
        phoneNumber: "081234",
      };

      mockRequest.body = loginUserRequest;

      (UserService.login as jest.Mock).mockResolvedValue(loginUserResponse);

      await UserController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(UserService.login).toHaveBeenCalledWith(loginUserRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: loginUserResponse,
      });
    });

    it("should call next with error if login fails", async () => {
      const loginUserRequest: LoginUserRequest = {
        phoneNumber: "081234",
        password: "password123",
      };

      const error = new Error("Login failed");

      mockRequest.body = loginUserRequest;

      (UserService.login as jest.Mock).mockRejectedValue(error);

      await UserController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("logout user", () => {
    it("should logout a user and return 200 status", async () => {
      const mockRequest = {
        user: {
          _id: 1,
        },
      } as CustomRequest;

      const logoutUserResponse: UserResponse = {
        id: 1,
        name: "John Doe",
        phoneNumber: "081234",
      };

      (UserService.logout as jest.Mock).mockResolvedValue(logoutUserResponse);

      await UserController.logout(
        mockRequest as CustomRequest,
        mockResponse as Response,
        mockNext
      );

      expect(UserService.logout).toHaveBeenCalledWith(mockRequest);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: logoutUserResponse,
      });
    });

    it("should call next with error if logout fails", async () => {
      const mockRequest = {
        user: {
          _id: 1,
        },
      } as CustomRequest;

      const error = new Error("Logout failed");

      (UserService.logout as jest.Mock).mockRejectedValue(error);

      await UserController.logout(
        mockRequest as CustomRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
