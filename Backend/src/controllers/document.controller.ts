import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

import * as docService from "../services/document.service";

export const postDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const file = req.file as any;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const doc = await docService.postDocumentService({
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


export const getAllDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const resp = await docService.getAllDocumentService(userId);

    res.status(200).json({
      success: true,
      data: resp,
    });

  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
     const  documentId  = req.params.documentId as string;

    const resp = await docService.getDocumentServiceById(userId,documentId);

    res.status(200).json({
      success: true,
      data: resp,
    });

  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

export const deleteDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
     const  documentId  = req.params.documentId as string;

    const resp = await docService.deleteDocumentServiceById(userId,documentId);

    res.status(200).json({
      success: true,
      data: resp,
    });

  } catch (err: any) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};