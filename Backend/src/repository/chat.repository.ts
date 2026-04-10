import { ChatModel } from "../models/chat.model";

export const createChat = async (data: any) => {
  try {
    const resp = await ChatModel.create(data);
    return resp;
  } catch (err) {
    console.error("saving to db error", err);
    throw new Error("Saving to DB Error");
  }
};


export const getChatHistory = async (userId: string, documentId: string) => {
  try {
    if (!userId || !documentId) {
      throw new Error("userId and documentId are required");
    }
    const resp = await ChatModel.find({
      userId,
      documentId,
    }).sort({ sequence: 1 }); 

    return resp;
  } catch (err) {
    console.error("fetching from db error", err);
    throw new Error("Fetching from DB Error");
  }
};


export const deleteChatHistory = async (userId: string, documentId: string) => {
  try {
    if (!userId || !documentId) {
      throw new Error("userId and documentId are required");
    }
    console.log("am here man")
    const resp = await ChatModel.deleteMany({
      userId,
      documentId,
    });

    return {
      success: true,
      deletedCount: resp.deletedCount,
    };
  } catch (err) {
    console.error("Deleting from db error:", err);
    throw new Error("Deleting chat history failed");
  }
};