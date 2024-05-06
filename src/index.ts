import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import { publicRouter } from "./api/routes/publicApi";
import { errorHandlerMiddleware } from "./api/middlewares/errorHandler";

//For env File
dotenv.config();

export const app: Application = express();
const port = process.env.PORT || 9000;
app.use(express.json());
app.use(publicRouter);
app.use(errorHandlerMiddleware);

// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome");
// });

// app.listen(port, () => {
//   console.log(`Server is Fire at http://localhost:${port}`);
// });
