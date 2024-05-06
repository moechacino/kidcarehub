import {
  CreateUserRequest,
  LoginUserRequest,
  UserResponse,
} from "../../models/userModel";
import { RegisterService } from "./registerService";
import { LoginService } from "./loginService";

export class UserService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    return RegisterService.register(request);
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    return LoginService.login(request);
  }
}
