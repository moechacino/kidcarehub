import { CustomRequest } from "../../middlewares/auth";
import {
  ChangePasswordWriterRequest,
  CreateWriterRequest,
  LoginWriterRequest,
  WriterResponse,
} from "../../models/writerModel";
import { ChangePasswordService } from "./changePasswordService";
import { LoginService } from "./loginService";
import { LogoutService } from "./logoutService";
import { RegisterService } from "./registerService";

export class WriterService {
  static async register(request: CreateWriterRequest): Promise<WriterResponse> {
    return RegisterService.register(request);
  }

  static async login(request: LoginWriterRequest): Promise<WriterResponse> {
    return LoginService.login(request);
  }

  static async logout(_id: number): Promise<WriterResponse> {
    return LogoutService.logout(_id);
  }

  static async changePassword(
    request: ChangePasswordWriterRequest,
    writerId: number
  ): Promise<WriterResponse> {
    return ChangePasswordService.changePassword(request, writerId);
  }
}
