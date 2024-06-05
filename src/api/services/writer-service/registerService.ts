import { prismaClient } from "../../../config/database";
import { ConflictRequestError } from "../../errors/ConflictRequestError";

import bcrypt from "bcrypt";
import {
  CreateWriterRequest,
  WriterResponse,
  toWriterResponse,
} from "../../models/writerModel";
import { Validation } from "../../validations/validation";
import { WriterValidation } from "../../validations/writerValidation";

export class RegisterService {
  static async register(request: CreateWriterRequest): Promise<WriterResponse> {
    const registerRequest = Validation.validate(
      WriterValidation.REGISTER,
      request
    );

    const isPhoneExist =
      (await prismaClient.writer.count({
        where: {
          phone: registerRequest.phone,
        },
      })) > 0;

    const isEmailExist =
      (await prismaClient.writer.count({
        where: {
          email: registerRequest.email,
        },
      })) > 0;

    const isUsernameExist =
      (await prismaClient.writer.count({
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

    const writer = await prismaClient.writer.create({
      data: registerRequest,
    });

    return toWriterResponse(writer);
  }
}
