import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { askQuestion } from "../controllers/chat.controller";

const router = express.Router();

router.post(
  "/ask",
  verifyToken,
  askQuestion
);

export default router;