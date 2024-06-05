import { Request, Response, NextFunction } from "express";
import {
  CreateWriterRequest,
  LoginWriterRequest,
  WriterResponse,
} from "../models/writerModel";
import { WriterService } from "../services/writer-service";
import { CustomRequest } from "../middlewares/auth";
import { Unauthenticated } from "../errors/Unauthenticated";

export class WriterController {
  static async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const writerRequest: CreateWriterRequest =
        request.body as CreateWriterRequest;
      const registerResponse: WriterResponse =
        await WriterService.register(writerRequest);

      response.status(201).json({
        success: true,
        data: registerResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const loginRequest: LoginWriterRequest =
        request.body as LoginWriterRequest;
      const loginResponse: WriterResponse =
        await WriterService.login(loginRequest);

      response.cookie("token", loginResponse.token!, {
        maxAge: 1000 * 60 * 60 * 2,
      });

      response.status(200).json({
        success: true,
        data: loginResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      if (!request.user) throw new Unauthenticated("You are not authorized");
      const { _id } = request.user!;
      if (!_id) throw new Unauthenticated("You are not authorized");

      const logoutResponse = await WriterService.logout(_id);
      response.status(200).json({
        success: true,
        data: logoutResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
