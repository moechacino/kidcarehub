import { prismaClient } from "../../../config/database";
import { CustomAPIError } from "../../errors/CustomAPIError";
import {
  ConsultantResponse,
  toConsultantResponse,
} from "../../models/consultantModel";

export class LogoutService {
  static async logout(_id: number): Promise<ConsultantResponse> {
    try {
      const loggedOutConsultant = await prismaClient.consultant.update({
        where: {
          id: _id,
        },
        data: {
          token: null,
        },
      });
      return toConsultantResponse(loggedOutConsultant);
    } catch (error) {
      throw new CustomAPIError("Failed to logout", 500);
    }
  }
}
