import {  Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import { askQuestionService } from "../services/chat.service";

export const askQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, documentId, question } = req.body;

    const result = await askQuestionService(
      userId,
      documentId,
      question
    );

    res.json(result);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};