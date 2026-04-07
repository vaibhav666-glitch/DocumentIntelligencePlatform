import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: String,
    documentId: String,
    role: {
      type: String,
      enum: ["user", "assistant"],
    },
    content: String,
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model("Chat", chatSchema);