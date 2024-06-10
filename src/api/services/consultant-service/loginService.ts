import { prismaClient } from "../../../config/database";
import { session_option_dev } from "../../../config/session-config";
import { NotFoundError } from "../../errors/NotFoundError";
import { Unauthenticated } from "../../errors/Unauthenticated";
import {
  ConsultantResponse,
  LoginConsultantRequest,
  toConsultantResponse,
} from "../../models/consultantModel";
import { ConsultantValidation } from "../../validations/consultantValidation";
import { Validation } from "../../validations/validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class LoginService {
  static async login(
    request: LoginConsultantRequest
  ): Promise<ConsultantResponse> {
    const SECRET_KEY = process.env.JWT_SECRET || "anjay_secret";
    const loginRequest = Validation.validate(
      ConsultantValidation.LOGIN,
      request
    );

    let consultant = await prismaClient.consultant.findUnique({
      where: {
        username: loginRequest.username,
      },
    });
    if (!consultant) throw new NotFoundError("username is not registered");

    const isMatch = await bcrypt.compare(
      loginRequest.password,
      consultant.password
    );
    if (!isMatch) throw new Unauthenticated("username or password is wrong");

    const token = jwt.sign(
      {
        _id: consultant.id,
        username: consultant.username,
        name: consultant.name,
        role: "consultant",
      },
      SECRET_KEY,
      session_option_dev
    );

    consultant = await prismaClient.consultant.update({
      where: { id: consultant.id },
      data: {
        token: token,
      },
    });
    const response = toConsultantResponse(consultant);
    response.token = consultant.token;

    return response;
  }
}
