import { Socket } from "socket.io";
import { NextFunction } from "express";
import { Unauthenticated } from "../errors/Unauthenticated";
import jwt, { Secret } from "jsonwebtoken";

export interface AuthenticatedSocket extends Socket {
  senderId: number;
  role: string;
}
export class AuthSocket {
  static authenticateSocket(
    socket: AuthenticatedSocket,
    next: (err?: Error) => void
  ) {
    const SECRET_KEY: Secret = process.env.JWT_SECRET || "anjay secret";
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Unauthenticated("Unauthorized"));
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
      const { _id, role } = decoded;
      socket.role = role;
      if (role === "user") {
        socket.senderId = _id;
        next();
      } else if (role === "consultant") {
        socket.senderId = _id;
        next();
      } else {
        next(new Unauthenticated("Unauthorized"));
      }
    } catch (error) {
      next(new Unauthenticated("Unauthorized"));
    }
  }
}
