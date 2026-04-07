import { Request, Response } from "express";
import { askQuestionService } from "../services/chat.service";

export const askQuestion = async (req: Request, res: Response) => {
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