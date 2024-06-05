import { prismaClient } from "../../../config/database";
import { CustomAPIError } from "../../errors/CustomAPIError";

import { UserResponse, toUserResponse } from "../../models/userModel";

export class LogoutService {
  static async logout(_id: number): Promise<UserResponse> {
    try {
      const loggedOutUser = await prismaClient.user.update({
        where: {
          id: _id,
        },
        data: {
          token: null,
        },
      });
      const response = toUserResponse(loggedOutUser);
      response.token = null;
      return response;
    } catch (error) {
      throw new CustomAPIError(`Failed to logout user. Errors: ${error}`, 500);
    }
  }
}
