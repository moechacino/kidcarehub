import { prismaClient } from "../../config/database";
import { Unauthenticated } from "../errors/Unauthenticated";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./auth";
export const verifyToken = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers.authorization;
  const _id = request.user?._id;

  const token = authHeader?.split(" ")[1];
  const user = await prismaClient.user.findUnique({
    where: {
      id: _id,
    },
  });

  if (user?.token) {
    if (token === user?.token) {
      next();
    }
    throw new Unauthenticated(
      "Your Access Token is Expired. Please Login Again"
    );
  }
  throw new Unauthenticated("No access");
};
