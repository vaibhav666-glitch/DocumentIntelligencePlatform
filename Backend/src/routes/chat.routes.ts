import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { askQuestion, getChatHistory } from "../controllers/chat.controller";

const router = express.Router();

router.post(
  "/ask",
  verifyToken,
  askQuestion
);

router.get(
  "/chatHistory/:documentId",
  verifyToken,
  getChatHistory
);

export default router;