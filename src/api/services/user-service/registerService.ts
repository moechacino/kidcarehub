import { prismaClient } from "../../../config/database";
import { ConflictRequestError } from "../../errors/ConflictRequestError";
import {
  CreateUserRequest,
  UserResponse,
  toUserResponse,
} from "../../models/userModel";
import { UserValidation } from "../../validations/userValidation";
import { Validation } from "../../validations/validation";
import bcrypt from "bcrypt";

export class RegisterService {
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const totalUserCount: number = await prismaClient.user.count({
      where: {
        phone: registerRequest.phone,
      },
    });

    const isUserExist = totalUserCount > 0 ? true : false;

    if (isUserExist) {
      throw new ConflictRequestError("Phone number is already registered");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prismaClient.user.create({
      data: registerRequest,
    });
    return toUserResponse(user);
  }
}
