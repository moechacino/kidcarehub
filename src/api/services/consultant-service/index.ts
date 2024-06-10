import {
  ChangePasswordConsultantRequest,
  ConsultantResponse,
  FilterGetConsultant,
  LoginConsultantRequest,
  RegisterConsultantRequest,
} from "../../models/consultantModel";
import { ChangePasswordService } from "./changePasswordService";
import { GetConsultantService } from "./getConsultantService";
import { LoginService } from "./loginService";
import { LogoutService } from "./logoutService";
import { RegisterService } from "./registerService";

export class ConsultantService {
  static async register(
    request: RegisterConsultantRequest
  ): Promise<ConsultantResponse> {
    return RegisterService.register(request);
  }

  static async login(
    request: LoginConsultantRequest
  ): Promise<ConsultantResponse> {
    return LoginService.login(request);
  }

  static async logout(consultantId: number): Promise<ConsultantResponse> {
    return LogoutService.logout(consultantId);
  }

  static async changePassword(
    request: ChangePasswordConsultantRequest,
    consultantId: number
  ): Promise<ConsultantResponse> {
    return ChangePasswordService.changePassword(request, consultantId);
  }

  static async getAll(
    filters: FilterGetConsultant,
    take: number,
    skip: number
  ): Promise<{
    consultants: ConsultantResponse[];
    page: {
      total: number;
      current: number;
    };
  }> {
    return GetConsultantService.getAllConsultant(filters, take, skip);
  }

  static async getOne(consultantId: number): Promise<ConsultantResponse> {
    return GetConsultantService.getOneConsultant(consultantId);
  }
}
