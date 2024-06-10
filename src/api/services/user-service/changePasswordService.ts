import { prismaClient } from "../../../config/database";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import {
  ChangePasswordUserRequest,
  UserResponse,
  toUserResponse,
} from "../../models/userModel";
import { UserValidation } from "../../validations/userValidation";
import { Validation } from "../../validations/validation";
import bcrypt from "bcrypt";
export class ChangePasswordService {
  static async changePassword(
    request: ChangePasswordUserRequest,
    userId: number
  ): Promise<UserResponse> {
    const changePasswordRequest = Validation.validate(
      UserValidation.CHANGE_PASSWORD,
      request
    );

    let user = await prismaClient.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundError(`user with id ${userId} is not registered`);
    }
    const isMatch = await bcrypt.compare(
      changePasswordRequest.password,
      user.password
    );
    if (!isMatch) throw new ForbiddenError("wrong password");
    const newPassword = await bcrypt.hash(
      changePasswordRequest.newPassword,
      10
    );
    user = await prismaClient.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
      },
    });

    return toUserResponse(user);
  }
}
