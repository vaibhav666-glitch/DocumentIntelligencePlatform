import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  fileName: String,
  fileUrl: String,

  status: {
    type: String,
    enum: ["processing", "ready", "failed"],
    default: "processing"
  },

  errorMessage: {
    type: String,
    default: null
  },

  failureReason: {
    type: String,
    enum: ["PARSING_ERROR", "EMBEDDING_ERROR", "CORRUPTED_FILE", "UNKNOWN"],
    default: null
  },

  attempts: {
    type: Number,
    default: 0
  },

  lastAttemptAt: {
    type: Date,
    default: null
  }

}, { timestamps: true });

export const DocumentModel = mongoose.model("Document", documentSchema);