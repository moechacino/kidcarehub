import { AdminResponse, LoginAdminRequest } from "../../models/adminModels";
import { LoginAdminService } from "./loginAdminService";
import { LogoutAdminService } from "./logoutAdminService";

export class AdminService {
  static async login(request: LoginAdminRequest): Promise<AdminResponse> {
    return LoginAdminService.login(request);
  }

  static async logout(_id: number): Promise<AdminResponse> {
    return LogoutAdminService.logout(_id);
  }
}
