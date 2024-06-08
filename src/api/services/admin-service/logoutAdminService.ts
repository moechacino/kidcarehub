import { prismaClient } from "../../../config/database";
import { CustomAPIError } from "../../errors/CustomAPIError";
import { AdminResponse, toAdminResponse } from "../../models/adminModels";

export class LogoutAdminService {
  static async logout(_id: number): Promise<AdminResponse> {
    try {
      const admin = await prismaClient.admin.update({
        where: {
          id: _id,
        },
        data: {
          token: null,
        },
      });

      return toAdminResponse(admin);
    } catch (error) {
      throw new CustomAPIError(
        JSON.stringify({
          message: "Failed to logout",
          errors: error,
        }),
        500
      );
    }
  }
}
