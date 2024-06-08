import express, { Express, Request, Response, Application } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import { publicRouter } from "./api/routes/publicApi";
import { errorHandlerMiddleware } from "./api/middlewares/errorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser = require("body-parser");
import notFoundMiddleware from "./api/middlewares/not-found";
//For env File
dotenv.config();
export const app: Application = express();
const port = process.env.PORT || 9000;
app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use("/api", publicRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome");
// });

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`server is listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
