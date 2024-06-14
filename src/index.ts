import express, { Express, Request, Response, Application } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import { publicRouter } from "./api/routes/publicApi";
import { errorHandlerMiddleware } from "./api/middlewares/errorHandler";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser = require("body-parser");
import notFoundMiddleware from "./api/middlewares/not-found";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import { AuthSocket, AuthenticatedSocket } from "./api/middlewares/authSocket";
import WebSockets from "./api/utils/WebSocket";

//For env File
dotenv.config();
const app: Application = express();
const server = createServer(app);
// web socket
const io = new Server(server, {
  connectionStateRecovery: {},
});
(globalThis as any).io = io;
const WebSocket = new WebSockets(io);
io.use(
  AuthSocket.authenticateSocket as (
    socket: Socket,
    next: (err?: Error) => void
  ) => void
);

io.on("connection", (socket) => {
  WebSocket.connection(socket as AuthenticatedSocket);
});

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

app.get("/test/chat/user", (req, res) => {
  res.sendFile(__dirname + "/public/user.html");
});
app.get("/test/chat/consultant", (req, res) => {
  res.sendFile(__dirname + "/public/consultant.html");
});
app.get("/test/chat/connect", (req, res) => {
  res.sendFile(__dirname + "/public/chatConnect.html");
});
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    server.listen(port, () => {
      console.log(`server is listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
