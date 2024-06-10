import {
  ChangePasswordUserRequest,
  CreateUserRequest,
  LoginUserRequest,
  UserResponse,
} from "../../models/userModel";
import { RegisterService } from "./registerService";
import { LoginService } from "./loginService";
import { CustomRequest } from "../../middlewares/auth";
import { LogoutService } from "./logoutService";
import { ChangePasswordService } from "./changePasswordService";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    return RegisterService.register(request);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    return LoginService.login(request);
  }

  static async logout(_id: number): Promise<UserResponse> {
    return LogoutService.logout(_id);
  }

  static async changePassword(
    request: ChangePasswordUserRequest,
    userId: number
  ): Promise<UserResponse> {
    return ChangePasswordService.changePassword(request, userId);
  }
}
