require("dotenv");
import { prismaClient } from "../../../config/database";
import { NotFoundError } from "../../errors/NotFoundError";
import {
  LoginUserRequest,
  UserResponse,
  toUserResponse,
} from "../../models/userModel";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Validation } from "../../validations/validation";
import { UserValidation } from "../../validations/userValidation";
import { Unauthenticated } from "../../errors/Unauthenticated";
import { session_option_dev } from "../../../config/session-config";

export class LoginService {
  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const SECRET_KEY: Secret = process.env.JWT_SECRET || "anjay_secret";
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prismaClient.user.findUnique({
      where: {
        phoneNumber: loginRequest.phoneNumber,
      },
    });

    if (!user) throw new NotFoundError("phone number is not registered");

    const isMatch = await bcrypt.compare(loginRequest.password, user.password);

    if (!isMatch) {
      throw new Unauthenticated("phone number and password is wrong");
    }

    const token = jwt.sign(
      {
        _id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: "user",
      },
      SECRET_KEY,
      session_option_dev
    );
    user = await prismaClient.user.update({
      where: { id: user.id },
      data: {
        token: token,
      },
    });

    const response = toUserResponse(user);
    response.token = user.token!;
    return response;
  }
}
