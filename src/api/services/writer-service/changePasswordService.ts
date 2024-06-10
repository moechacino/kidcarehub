import { prismaClient } from "../../../config/database";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import {
  ChangePasswordWriterRequest,
  WriterResponse,
  toWriterResponse,
} from "../../models/writerModel";
import { Validation } from "../../validations/validation";
import { WriterValidation } from "../../validations/writerValidation";
import bcrypt from "bcrypt";
export class ChangePasswordService {
  static async changePassword(
    request: ChangePasswordWriterRequest,
    writerId: number
  ): Promise<WriterResponse> {
    const changePasswordRequest = Validation.validate(
      WriterValidation.CHANGE_PASSWORD,
      request
    );

    let writer = await prismaClient.writer.findUnique({
      where: { id: writerId },
    });
    if (!writer) {
      throw new NotFoundError(`Writer with id ${writerId} is not found`);
    }
    const isMatch = await bcrypt.compare(
      changePasswordRequest.password,
      writer?.password
    );

    if (!isMatch) throw new ForbiddenError("wrong password");
    const newPassword = await bcrypt.hash(
      changePasswordRequest.newPassword,
      10
    );
    writer = await prismaClient.writer.update({
      where: { id: writerId },
      data: {
        password: newPassword,
      },
    });

    return toWriterResponse(writer);
  }
}
