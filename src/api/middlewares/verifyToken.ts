import { prismaClient } from "../../config/database";
import { Unauthenticated } from "../errors/Unauthenticated";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "./auth";
import { ArticleMulterRequest } from "../models/multerModel";
import { NotFoundError } from "../errors/NotFoundError";
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
  } else if (role === "consultant") {
    authenticatedUser = await prismaClient.consultant.findUnique({
      where: {
        id: _id,
      },
    });
  }

  if (!authenticatedUser)
    throw new NotFoundError("Your Id is not found, You are not registered");
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
