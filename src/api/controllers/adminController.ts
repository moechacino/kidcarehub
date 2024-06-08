import { Request, Response, NextFunction } from "express";
import { AdminResponse, LoginAdminRequest } from "../models/adminModels";
import { AdminService } from "../services/admin-service";
import { CustomRequest } from "../middlewares/auth";

export class AdminController {
  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const loginAdminRequest: LoginAdminRequest =
        request.body as LoginAdminRequest;

      const loginAdminResponse: AdminResponse =
        await AdminService.login(loginAdminRequest);

      response.status(200).json({
        success: true,
        data: loginAdminResponse,
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
      const _id = request.user?._id!;
      const logoutAdminResponse: AdminResponse = await AdminService.logout(_id);
      response.status(200).json({
        success: true,
        data: logoutAdminResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
