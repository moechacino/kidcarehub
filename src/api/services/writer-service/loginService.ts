import { Secret } from "jsonwebtoken";
import {
  LoginWriterRequest,
  WriterResponse,
  toWriterResponse,
} from "../../models/writerModel";
import { Validation } from "../../validations/validation";
import { WriterValidation } from "../../validations/writerValidation";
import { prismaClient } from "../../../config/database";
import { NotFoundError } from "../../errors/NotFoundError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Unauthenticated } from "../../errors/Unauthenticated";
import { session_option_dev } from "../../../config/session-config";
export class LoginService {
  static async login(request: LoginWriterRequest): Promise<WriterResponse> {
    const SECRET_KEY: Secret = process.env.JWT_SECRET || "anjay_secret";
    const loginRequest = Validation.validate(WriterValidation.LOGIN, request);

    let writer = await prismaClient.writer.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!writer) throw new NotFoundError("username is not found");

    const isMatch = await bcrypt.compare(
      loginRequest.password,
      writer.password
    );

    if (!isMatch) throw new Unauthenticated("username and password is wrong");

    const token = jwt.sign(
      {
        _id: writer.id,
        username: writer.username,
        role: "writer",
      },
      SECRET_KEY,
      session_option_dev
    );

    writer = await prismaClient.writer.update({
      where: { id: writer.id },
      data: {
        token: token,
      },
    });
    const response = toWriterResponse(writer);
    response.token = writer.token!;
    return response;
  }
}
