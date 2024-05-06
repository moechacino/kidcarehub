import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Unauthenticated } from "../errors/Unauthenticated";

export interface CustomRequest extends Request {
  user?: {
    _id: number;
    name: string;
    phoneNumber: string;
  };
}

export const authenticationMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;

  const SECRET_KEY: Secret = process.env.JWT_SECRET || "anjay secret";
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Unauthenticated("no token provided");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const { _id, name, phoneNumber } = decoded;
    (request as CustomRequest).user = { _id, name, phoneNumber };
    next();
  } catch (error) {
    throw new Unauthenticated("No access");
  }
};
