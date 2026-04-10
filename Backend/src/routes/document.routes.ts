import express from "express";
import { postDocument,getAllDocument, getDocumentById, deleteDocumentById } from "../controllers/document.controller";
import { upload } from "../middleware/upload.middleware";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("file"), 
  postDocument
);

router.get(
  "/",
  verifyToken,
  getAllDocument
);

router.get(
  "/:documentId",
  verifyToken,
  getDocumentById
);

router.delete(
  "/:documentId",
  verifyToken,
  deleteDocumentById
);


export default router;