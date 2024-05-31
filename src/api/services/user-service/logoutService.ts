import { prismaClient } from "../../../config/database";
import { CustomAPIError } from "../../errors/CustomAPIError";
import { Unauthenticated } from "../../errors/Unauthenticated";
import { CustomRequest } from "../../middlewares/auth";
import { UserResponse, toUserResponse } from "../../models/userModel";

export class LogoutService {
  static async logout(request: CustomRequest): Promise<UserResponse> {
    if (request.user) {
      const { _id } = request.user;

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
        throw new CustomAPIError(
          `Failed to logout user. Errors: ${error}`,
          500
        );
      }
    } else {
      throw new Unauthenticated("User is not authenticated");
    }
  }
}
