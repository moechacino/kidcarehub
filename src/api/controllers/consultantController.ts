import { CustomRequest } from "../middlewares/auth";
import { Request, Response, NextFunction } from "express";
import {
  ChangePasswordConsultantRequest,
  FilterGetConsultant,
  LoginConsultantRequest,
  RegisterConsultantRequest,
} from "../models/consultantModel";
import { ConsultantService } from "../services/consultant-service";
import { BadRequestError } from "../errors/BadRequestError";
export class ConsultantController {
  static async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const registerConsultantRequest: RegisterConsultantRequest =
        request.body as RegisterConsultantRequest;

      const registerConsultantResponse = await ConsultantService.register(
        registerConsultantRequest
      );

      response.status(201).json({
        success: true,
        data: registerConsultantResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const loginConsultantRequest: LoginConsultantRequest =
        request.body as LoginConsultantRequest;

      const loginConsultantResponse = await ConsultantService.login(
        loginConsultantRequest
      );

      response.status(200).json({
        success: true,
        data: loginConsultantResponse,
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
      const _id = request.user?._id!;
      const logoutConsultantResponse = await ConsultantService.logout(_id);
      response.status(200).json({
        success: true,
        data: logoutConsultantResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const _id = request.user?._id!;
      const changePasswordRequest: ChangePasswordConsultantRequest =
        request.body as ChangePasswordConsultantRequest;

      const changePasswordResponse = await ConsultantService.changePassword(
        changePasswordRequest,
        _id
      );
      response.status(200).json({
        success: true,
        data: changePasswordResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { alumnus, profession, workPlace, name } = request.query;
      const pageStr: string | undefined =
        typeof request.query.page === "string" ? request.query.page : undefined;
      const takeStr: string | undefined =
        typeof request.query.take === "string" ? request.query.take : undefined;

      //---------- pagination --------------
      const page: number = pageStr ? parseInt(pageStr, 10) || 1 : 1;
      const take: number = takeStr ? parseInt(takeStr, 10) || 4 : 4;
      const skip: number = (page - 1) * take;
      //------------------------------------
      const filters: FilterGetConsultant = {
        alumnus: alumnus,
        profession: profession,
        workPlace: workPlace,
        name: name,
      } as FilterGetConsultant;

      const getAllResponse = await ConsultantService.getAll(
        filters,
        take,
        skip
      );
      response.status(200).json({
        success: true,
        data: getAllResponse,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOne(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { consultantId } = request.params;
      if (isNaN(Number(consultantId)))
        throw new BadRequestError("id must be number");

      const getOneResponse = await ConsultantService.getOne(
        parseInt(consultantId)
      );

      response.status(200).json({
        success: true,
        data: getOneResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
