import { prismaClient } from "../../../config/database";
import { CustomAPIError } from "../../errors/CustomAPIError";
import { Unauthenticated } from "../../errors/Unauthenticated";
import { CustomRequest } from "../../middlewares/auth";
import { WriterResponse, toWriterResponse } from "../../models/writerModel";

export class LogoutService {
  static async logout(_id: number): Promise<WriterResponse> {
    if (_id) {
      try {
        const loggedOutWriter = await prismaClient.writer.update({
          where: {
            id: _id,
          },
          data: {
            token: null,
          },
        });
        return toWriterResponse(loggedOutWriter);
      } catch (error) {
        throw new CustomAPIError(`Failed to logout user`, 500);
      }
    } else {
      throw new Unauthenticated("You are not authorized");
    }
  }
}
