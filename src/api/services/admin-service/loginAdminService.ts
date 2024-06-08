import { Secret } from "jsonwebtoken";
import {
  AdminResponse,
  LoginAdminRequest,
  toAdminResponse,
} from "../../models/adminModels";
import { Validation } from "../../validations/validation";
import { AdminValidation } from "../../validations/adminValidation";
import { prismaClient } from "../../../config/database";
import { NotFoundError } from "../../errors/NotFoundError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Unauthenticated } from "../../errors/Unauthenticated";
import { session_option_dev } from "../../../config/session-config";
export class LoginAdminService {
  static async login(request: LoginAdminRequest): Promise<AdminResponse> {
    const SECRET_KEY: Secret = process.env.JWT_SECRET || "anjay_secret";
    const loginRequest = Validation.validate(AdminValidation.LOGIN, request);

    let admin = await prismaClient.admin.findUnique({
      where: {
        username: loginRequest.username,
      },
    });
    if (!admin) throw new NotFoundError("you are not registered");

    const isMatch = loginRequest.password === admin.password;
    if (!isMatch) {
      throw new Unauthenticated("username or password is wrong");
    }

    const token = jwt.sign(
      {
        _id: admin.id,
        username: admin.username,
        role: "admin",
      },
      SECRET_KEY,
      session_option_dev
    );

    admin = await prismaClient.admin.update({
      where: { id: admin.id },
      data: {
        token: token,
      },
    });

    return toAdminResponse(admin);
  }
}
