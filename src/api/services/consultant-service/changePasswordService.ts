import { prismaClient } from "../../../config/database";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import {
  ChangePasswordConsultantRequest,
  ConsultantResponse,
  toConsultantResponse,
} from "../../models/consultantModel";
import { ConsultantValidation } from "../../validations/consultantValidation";
import { Validation } from "../../validations/validation";
import bcrypt from "bcrypt";
export class ChangePasswordService {
  static async changePassword(
    request: ChangePasswordConsultantRequest,
    consultantId: number
  ): Promise<ConsultantResponse> {
    const changePasswordRequest = Validation.validate(
      ConsultantValidation.CHANGE_PASSWORD,
      request
    );

    let consultant = await prismaClient.consultant.findUnique({
      where: { id: consultantId },
    });

    if (!consultant) {
      throw new NotFoundError(
        `consultant with id ${consultantId} is not found`
      );
    }
    const isMatch = await bcrypt.compare(
      changePasswordRequest.password,
      consultant?.password
    );

    if (!isMatch) throw new ForbiddenError("wrong password");
    const newPassword = await bcrypt.hash(
      changePasswordRequest.newPassword,
      10
    );
    consultant = await prismaClient.consultant.update({
      where: { id: consultantId },
      data: {
        password: newPassword,
      },
    });

    return toConsultantResponse(consultant);
  }
}
