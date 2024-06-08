import { Unauthenticated } from "../errors/Unauthenticated";
import { CustomRequest } from "./auth";
import { Response, NextFunction } from "express";

export class OnlyAccessedBy {
  static async user(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    const role = request.user?.role!;
    if (role === "user") {
      next();
    } else {
      throw new Unauthenticated("You do not have access to this route");
    }
  }
  static async writer(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    const role = request.user?.role!;
    if (role === "writer") {
      next();
    } else {
      throw new Unauthenticated("You do not have access to this route");
    }
  }
  static async admin(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    const role = request.user?.role!;
    if (role === "admin") {
      next();
    } else {
      throw new Unauthenticated("You do not have access to this route");
    }
  }
  static async consultant(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    const role = request.user?.role!;
    if (role === "consultant") {
      next();
    } else {
      throw new Unauthenticated("You do not have access to this route");
    }
  }
}
