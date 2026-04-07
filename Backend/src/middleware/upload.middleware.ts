import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/clodinary"

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "documents",
      resource_type: "raw", // important for pdf/docx
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

export const upload = multer({ storage });