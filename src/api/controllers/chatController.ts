import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/BadRequestError";
import { Unauthenticated } from "../errors/Unauthenticated";
import { CustomRequest } from "../middlewares/auth";
import { ChatService } from "../services/chat-service";

export class ChatController {
  static async connect(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const userId = request.user?._id!;
      const consultantId = request.params.consultantId || null;
      if (
        !consultantId ||
        isNaN(Number(consultantId)) ||
        typeof consultantId !== "string"
      ) {
        throw new BadRequestError("input consultant id correctly");
      }

      const responseConnect = await ChatService.connect(
        userId,
        parseInt(consultantId)
      );
      response.status(201).json({
        success: true,
        data: responseConnect,
      });
    } catch (error) {
      next(error);
    }
  }

  static async saveMessage(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const role = request.user?.role!;
      let userId: number;
      let consultantId: number;
      const { message } = request.body;
      if (role === "user") {
        userId = request.user?._id!;
        const _consultantId = request.params.consultantId || null;
        if (
          !_consultantId ||
          isNaN(Number(_consultantId)) ||
          typeof _consultantId !== "string"
        ) {
          throw new BadRequestError("input consultant id correctly");
        }
        consultantId = parseInt(_consultantId);
      } else if (role === "consultant") {
        consultantId = request.user?._id!;
        const _userId = request.params.userId || null;
        if (!_userId || isNaN(Number(_userId)) || typeof _userId !== "string") {
          throw new BadRequestError("input user id correctly");
        }
        userId = parseInt(_userId);
      } else {
        throw new Unauthenticated(
          "Unauthorized or you dont have access this route"
        );
      }

      await ChatService.saveMessage(userId, consultantId, message, role);

      response.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  static getChat(
    request: CustomRequest,
    response: Response,
    next: NextFunction
  ) {
    try {
      const _id = request.user?._id!;
      let groupChatId = request.params.groupChatId || null;
      if (
        !groupChatId ||
        isNaN(Number(groupChatId)) ||
        typeof groupChatId !== "string"
      )
        throw new BadRequestError("input group chat id correctly");

      const chats = ChatService.getChat(parseInt(groupChatId), _id);

      response.status(200).json({
        success: true,
        data: chats,
      });
    } catch (error) {
      next(error);
    }
  }
}
