import { Server } from "socket.io";
import { AuthenticatedSocket } from "../middlewares/authSocket";
import { Unauthenticated } from "../errors/Unauthenticated";
import { prismaClient } from "../../config/database";

interface ChatSession {
  room: string;
  userId: number;
  consultantId: number;
  startTime: number;
}

class WebSockets {
  constructor(private io: Server) {}

  connection(client: AuthenticatedSocket) {
    client.on("join", async (groupChatId: string) => {
      try {
        const { senderId, role } = client;
        const dateNow = new Date();
        if (isNaN(Number(groupChatId)))
          throw new Error("groupChatId must be number integer");

        const groupChat = await prismaClient.groupChat.findUnique({
          where: { id: parseInt(groupChatId) },
        });

        if (!groupChat) {
          throw new Error(`Group chat with ID ${groupChatId} not found`);
        }

        if (
          (role === "user" && groupChat.userId !== senderId) ||
          (role === "consultant" && groupChat.consultantId !== senderId)
        ) {
          throw new Error("No access");
        }

        const endAt = new Date(groupChat.endAt);
        console.log(dateNow);
        console.log(endAt);
        console.log(endAt < dateNow);
        if (groupChat.endAt && endAt < dateNow) {
          throw new Error(
            `Chat session for groupChatId ${groupChatId} has expired`
          );
        }

        client.join(groupChat.roomName);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error handling chat message:", error.message);
          client.emit("error", { message: error.message });
        }
      }
    });

    client.on("chat", async (groupChatId: string, message: string) => {
      try {
        const { senderId, role } = client;
        const dateNow = new Date();
        if (isNaN(Number(groupChatId)))
          throw new Error("groupChatId must be number integer");

        const groupChat = await prismaClient.groupChat.findUnique({
          where: { id: parseInt(groupChatId) },
        });

        if (!groupChat) {
          throw new Error(`Group chat with ID ${groupChatId} not found`);
        }

        if (
          (role === "user" && groupChat.userId !== senderId) ||
          (role === "consultant" && groupChat.consultantId !== senderId)
        ) {
          throw new Error("No access");
        }

        const endAt = new Date(groupChat.endAt);
        console.log(dateNow);
        console.log(endAt);
        console.log(endAt < dateNow);
        if (groupChat.endAt && endAt < dateNow) {
          throw new Error(
            `Chat session for groupChatId ${groupChatId} has expired`
          );
        }

        const savedMessage = await prismaClient.message.create({
          data: {
            message: message,
            senderId: senderId,
            senderRole: role,
            groupChatId: parseInt(groupChatId),
          },
        });

        this.io.to(groupChat.roomName).emit("chat", message, senderId);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error handling chat message:", error.message);
          client.emit("error", { message: error.message });
        }
      }
    });
  }
}

export default WebSockets;
// connection(client: AuthenticatedSocket) {
//     client.on("start_chat", (consultantId: number) => {
//       const userId = client.userId;
//       if (!userId || !consultantId) {
//         console.error("Missing userId or consultantId");
//         return;
//       }

//       const existingSession = this.sessions.find(
//         (session) =>
//           (session.userId === userId &&
//             session.consultantId === consultantId) ||
//           (session.userId === consultantId && session.consultantId === userId)
//       );

//       if (existingSession) {
//         console.error("Chat session already exists");
//         return;
//       }

//       const room = `room-${userId}-${consultantId}`;
//       this.sessions.push({
//         room,
//         userId,
//         consultantId,
//         startTime: Date.now(),
//       });
//       client.join(room);

//       setTimeout(
//         () => {
//           this.io.to(room).emit("end_chat", "Chat session has ended.");
//           client.leave(room);
//           const index = this.sessions.findIndex(
//             (session) => session.room === room
//           );
//           if (index !== -1) {
//             this.sessions.splice(index, 1);
//           }
//         },
//         30 * 60 * 1000
//       );
//     });

//     client.on("send_message", (room: string, message: string) => {
//       this.io.to(room).emit("chat_message", message);
//     });

//     client.on("disconnect", () => {
//       this.cleanupSession(client);
//     });
//   }

//  cleanupSession(client: AuthenticatedSocket) {
//     const userId = client.userId;
//     const consultantId = client.consultantId;

//     if (!userId || !consultantId) {
//       return;
//     }

//     const sessionIndex = this.sessions.findIndex(
//       (session) =>
//         (session.userId === userId && session.consultantId === consultantId) ||
//         (session.userId === consultantId && session.consultantId === userId)
//     );

//     if (sessionIndex !== -1) {
//       const room = this.sessions[sessionIndex].room;
//       client.leave(room);
//       this.sessions.splice(sessionIndex, 1);
//     }
//   }
