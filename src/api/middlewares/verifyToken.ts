import { prismaClient } from "../../config/database";
import { Unauthenticated } from "../errors/Unauthenticated";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./auth";
import { ArticleMulterRequest } from "../models/multerModel";
export const verifyToken = async (
  request: CustomRequest | ArticleMulterRequest,
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
    } else {
      throw new Unauthenticated(
        "Your Access Token is Expired. Please Login Again"
      );
    }
  } else {
    throw new Unauthenticated("No access");
  }
};
