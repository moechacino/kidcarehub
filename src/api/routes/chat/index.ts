import express from "express";
import { authenticationMiddleware } from "../../middlewares/auth";
import { verifyToken } from "../../middlewares/verifyToken";
import { OnlyAccessedBy } from "../../middlewares/onlyAccessedBy";
import { ChatController } from "../../controllers/chatController";
const chatRouter = express.Router();

chatRouter
  .route("/connect/:consultantId")
  .get(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.user,
    ChatController.connect
  );

chatRouter
  .route("/save/user/:consultantId")
  .post(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.user,
    ChatController.saveMessage
  );
chatRouter
  .route("/save/consultant/:userId")
  .post(
    authenticationMiddleware,
    verifyToken,
    OnlyAccessedBy.consultant,
    ChatController.saveMessage
  );

chatRouter
  .route("/:groupChatId")
  .get(authenticationMiddleware, verifyToken, ChatController.getChat);

export default chatRouter;
