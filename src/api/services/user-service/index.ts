import {
  CreateUserRequest,
  LoginUserRequest,
  UserResponse,
} from "../../models/userModel";
import { RegisterService } from "./registerService";
import { LoginService } from "./loginService";
import { CustomRequest } from "../../middlewares/auth";
import { LogoutService } from "./logoutService";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    return RegisterService.register(request);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    return LoginService.login(request);
  }

  static async logout(request: CustomRequest): Promise<UserResponse> {
    return LogoutService.logout(request);
  }
}
