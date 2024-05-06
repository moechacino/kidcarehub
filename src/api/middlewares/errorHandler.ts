import { Request, Response, NextFunction } from "express";
import { CustomAPIError } from "../errors/CustomAPIError";
import { ZodError } from "zod";
export const errorHandlerMiddleware = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      errors: `Validation Error : ${JSON.stringify(error)}`,
    });
  } else if (error instanceof CustomAPIError) {
    res.status(error.statusCode).json({
      errors: error.message,
    });
  } else {
    res.status(500).send("Something went wrong please try again");
  }
};
