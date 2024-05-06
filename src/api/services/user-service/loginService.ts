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

export class LoginService {
  static async login(request: LoginUserRequest): Promise<UserResponse> {
    const SECRET_KEY: Secret = process.env.JWT_SECRET || "anjay_secret";
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    let user = await prismaClient.user.findUnique({
      where: {
        phoneNumber: loginRequest.phoneNumber,
      },
    });

    if (!user) throw new NotFoundError("user is not found");

    const isMatch = await bcrypt.compare(loginRequest.password, user.password);

    if (!isMatch) {
      throw new Unauthenticated("wrong password");
    }

    const token = jwt.sign(
      {
        _id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
      SECRET_KEY,
      {
        expiresIn: "36000",
      }
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
