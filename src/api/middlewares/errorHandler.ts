import { Request, Response, NextFunction } from "express";
import { CustomAPIError } from "../errors/CustomAPIError";
import { ZodError } from "zod";
export const errorHandlerMiddleware = async (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => {
      return {
        path: err.path.join("."),
        message: err.message,
        code: err.code,
      };
    });

    response.status(400).json({
      errors: formattedErrors,
    });
  } else if (error instanceof CustomAPIError) {
    response.status(error.statusCode).json({
      errors: error.message,
    });
  } else {
    console.log(error);
    response.status(500).send("Something went wrong please try again");
  }
};
