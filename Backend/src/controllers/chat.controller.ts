import {  Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import { askQuestionService, getChatHistoryService } from "../services/chat.service";

export const askQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const {documentId, question } = req.body;

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


export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
     const  documentId  = req.params.documentId as string;


    const result = await getChatHistoryService(
      userId,
      documentId,
    
    );

     res.status(200).json({
      success: true,
      data: result,
    });

  } catch (err: any) {
   res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};