import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { followUpSuggestion, initialSuggestion } from "../controllers/suggestion.controller";

const router = express.Router();

router.get(
  "/initial/:documentId",
  verifyToken,
  initialSuggestion
);
router.post(
  "/followup/:documentId",
  verifyToken,
  followUpSuggestion
);

export default router;