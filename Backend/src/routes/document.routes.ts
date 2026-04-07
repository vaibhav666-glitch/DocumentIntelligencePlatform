import express from "express";
import { postDocumentController } from "../controllers/document.controller";
import { upload } from "../middleware/upload.middleware";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("file"), 
  postDocumentController
);

export default router;