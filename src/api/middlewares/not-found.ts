import { Request, Response } from "express";

const notFoundMiddleware = (request: Request, response: Response) => {
  response.status(404).send("This Route does not exist");
};

export default notFoundMiddleware;
