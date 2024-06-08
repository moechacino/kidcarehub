import { NextFunction, Request, Response } from "express";
import {
  CreateUserRequest,
  LoginUserRequest,
  UserResponse,
} from "../models/userModel";
import { UserService } from "../services/user-service";
import { CustomRequest } from "../middlewares/auth";
import { Unauthenticated } from "../errors/Unauthenticated";
import { session_option_prod } from "../../config/session-config";

export class UserController {
  static async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const createUserRequest: CreateUserRequest =
        request.body as CreateUserRequest;
      const createUserResponse: UserResponse =
        await UserService.register(createUserRequest);

      response.status(201).json({
        success: true,
        data: createUserResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const loginUserRequest: LoginUserRequest =
        request.body as LoginUserRequest;

      const loginUserResponse = await UserService.login(loginUserRequest);

      response.status(200).json({
        success: true,
        data: loginUserResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (!request.user) throw new Unauthenticated("You are not authorized");
      const { _id } = request.user!;
      if (!_id) throw new Unauthenticated("You are not authorized");

      const logoutUserResponse = await UserService.logout(_id);

      response.status(200).json({
        success: true,
        data: logoutUserResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
