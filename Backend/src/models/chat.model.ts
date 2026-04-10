import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    documentId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    
    sequence: {
      type: Number,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);


chatSchema.index({ userId: 1, documentId: 1, sequence: 1 });

export const ChatModel = mongoose.model("Chat", chatSchema);