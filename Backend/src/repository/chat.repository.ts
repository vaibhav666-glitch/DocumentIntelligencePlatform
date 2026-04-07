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