import { prismaClient } from "../../../config/database";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import { Unauthenticated } from "../../errors/Unauthenticated";
import { ConsultantQuery } from "../../query/consultant";

export class ChatService {
  static async connect(
    userId: number,
    consultantId: number
  ): Promise<{
    id: number;
    roomName: string;
  }> {
    const isGroupExist = await prismaClient.groupChat.findFirst({
      where: {
        userId: userId,
        consultantId: consultantId,
      },
    });

    const date = new Date();
    if (isGroupExist) {
      if (new Date(isGroupExist.endAt) >= date) {
        throw new ForbiddenError(
          `User ${userId} with Consultant ${consultantId} had been connected`
        );
      } else {
        await prismaClient.groupChat.delete({
          where: { id: isGroupExist.id },
        });
      }
    }
    const room = `user${userId}-with-consultant${consultantId}`;
    const group = await prismaClient.groupChat.create({
      data: {
        userId: userId,
        consultantId: consultantId,
        roomName: room,
        startAt: date,
        endAt: new Date(date.getTime() + 30 * 60 * 1000),
      },
    });

    return group;
  }

  static async saveMessage(
    userId: number,
    consultantId: number,
    message: string,
    role: string
  ): Promise<void> {
    const groupChat = await prismaClient.groupChat.findFirst({
      where: {
        userId: userId,
        consultantId: consultantId,
      },
    });
    if (role !== "user" && role !== "consultant") {
      throw new Unauthenticated("Unauthorized");
    }

    if (!groupChat)
      throw new NotFoundError(
        `User ${userId} with Consultant ${consultantId} does not have session`
      );

    const savedMessage = await prismaClient.message.create({
      data: {
        senderId: userId,
        senderRole: role,
        message: message,
        groupChat: { connect: { id: groupChat.id } },
      },
    });
  }

  static async getUserChatLists(userId: number): Promise<object[]> {
    const consultants: object[] = [];
    const groupChat = await prismaClient.groupChat.findMany({
      where: {
        userId: userId,
      },
    });
    const query = ConsultantQuery.select();
    for (const val of groupChat) {
      const consultant = await prismaClient.consultant.findUnique({
        where: {
          id: val.consultantId,
        },
        select: query,
      });

      if (consultant)
        consultants.push({
          consultant,
          groupChat: {
            id: val.id,
            roomName: val.roomName,
          },
        });
    }

    return consultants;
  }

  static async getConsultantChatLists(consultantId: number): Promise<object[]> {
    const users: object[] = [];
    const groupChat = await prismaClient.groupChat.findMany({
      where: {
        consultantId: consultantId,
      },
    });
    for (const val of groupChat) {
      const user = await prismaClient.user.findUnique({
        where: {
          id: val.consultantId,
        },
        select: {
          id: true,
          name: true,
          photoProfile: true,
        },
      });

      if (user)
        users.push({
          user,
          groupChat: {
            id: val.id,
            roomName: val.roomName,
          },
        });
    }

    return users;
  }

  static async getChat(
    groupChatId: number,
    userIdOrConsultantId: number
  ): Promise<object[]> {
    const groupChat = await prismaClient.groupChat.findUnique({
      where: {
        id: groupChatId,
      },
    });

    if (
      userIdOrConsultantId !== groupChat?.consultantId &&
      userIdOrConsultantId !== groupChat?.userId
    ) {
      throw new ForbiddenError("you dont have access to acess this");
    }

    const messages = await prismaClient.message.findMany({
      where: {
        groupChatId: groupChatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  }
}
