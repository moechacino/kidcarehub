import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Unauthenticated } from "../errors/Unauthenticated";
import { CustomAPIError } from "../errors/CustomAPIError";

export interface CustomRequest extends Request {
  user?: {
    _id: number;
    name: string;
    phoneNumber: string;
    role: string;
  };
}

export const authenticationMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const SECRET_KEY: Secret = process.env.JWT_SECRET || "anjay secret";

  let token: string;
  const cookiesToken = request.cookies?.["token"] || null;
  if (cookiesToken) {
    token = cookiesToken;
  } else {
    const authHeader = request.headers.authorization || null;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Unauthenticated("no token provided");
    }

    token = authHeader.split(" ")[1];
  }
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const { _id, name, phoneNumber, role } = decoded;
    (request as CustomRequest).user = { _id, name, phoneNumber, role };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Unauthenticated("Token is expired");
    } else if (err instanceof jwt.JsonWebTokenError) {
      throw new Unauthenticated("Token is invalid");
    } else {
      throw new Error("something went wrong try again later");
    }
  }
};
