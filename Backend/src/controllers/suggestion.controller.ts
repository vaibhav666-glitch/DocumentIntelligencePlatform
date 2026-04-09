import { getFollowUpSuggestions, getInitialSuggestions } from "../services/suggestion.service";
import {  Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

export const initialSuggestion = async (req:AuthRequest, res:Response) => {
  try {
    const userId = req.user.id;
    const  documentId  = req.params.documentId as string;
    console.log("am documentId",documentId)
    const suggestions = await getInitialSuggestions(userId,documentId);
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
};  

export const followUpSuggestion = async (req:AuthRequest, res:Response) => {
  try {
    const userId = req.user.id;
    const  documentId  = req.params.documentId as string;
    console.log("am documentId",documentId)
    const {question,answer}=req.body;
    const suggestions = await getFollowUpSuggestions(userId,documentId,question,answer);
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
};  