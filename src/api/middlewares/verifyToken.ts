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
  const role = request.user?.role;

  const token = authHeader?.split(" ")[1];
  let authenticatedUser;
  if (role === "user") {
    authenticatedUser = await prismaClient.user.findUnique({
      where: {
        id: _id,
      },
    });
  } else if (role === "writer") {
    authenticatedUser = await prismaClient.writer.findUnique({
      where: {
        id: _id,
      },
    });
  } else if (role === "admin") {
    authenticatedUser = await prismaClient.admin.findUnique({
      where: {
        id: _id,
      },
    });
  }

  if (authenticatedUser!.token) {
    if (token === authenticatedUser!.token) {
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
