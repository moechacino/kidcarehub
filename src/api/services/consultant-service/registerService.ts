import { prismaClient } from "../../../config/database";
import { ConflictRequestError } from "../../errors/ConflictRequestError";
import {
  ConsultantResponse,
  RegisterConsultantRequest,
  toConsultantResponse,
} from "../../models/consultantModel";
import { ConsultantValidation } from "../../validations/consultantValidation";
import { Validation } from "../../validations/validation";
import bcrypt from "bcrypt";
export class RegisterService {
  static async register(
    request: RegisterConsultantRequest
  ): Promise<ConsultantResponse> {
    const registerRequest = Validation.validate(
      ConsultantValidation.REGISTER,
      request
    );

    const isPhoneExist =
      (await prismaClient.consultant.count({
        where: {
          phone: registerRequest.phone,
        },
      })) > 0;

    const isEmailExist =
      (await prismaClient.consultant.count({
        where: {
          email: registerRequest.email,
        },
      })) > 0;

    const isUsernameExist =
      (await prismaClient.consultant.count({
        where: {
          username: registerRequest.username,
        },
      })) > 0;

    if (isPhoneExist) {
      throw new ConflictRequestError("Phone number is already used");
    }

    if (isEmailExist) {
      throw new ConflictRequestError("Email is already used");
    }

    if (isUsernameExist) {
      throw new ConflictRequestError("Username is already used");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const consultant = await prismaClient.consultant.create({
      data: registerRequest,
    });

    return toConsultantResponse(consultant);
  }
}
