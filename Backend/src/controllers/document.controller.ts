import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import * as postDocService from "../services/document.service";

export const postDocumentController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const file = req.file as any;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const doc = await postDocService.postDocumentService({
      userId,
      fileName: file.originalname,
      fileUrl: file.path, // cloudinary URL
    });

    return res.status(201).json({
      message: "Uploaded successfully",
      document: doc,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};