import { DocumentModel } from "../models/document.model";
import { deleteChatHistory } from "./chat.repository";

export const postDocument = async (obj: any) => {
  try {
    const resp = await DocumentModel.create(obj);
    return resp;
  } catch (err) {
    console.error("saving to db error", err);
    throw new Error("Saving to DB Error");
  }
};

export const updateDocument = async (docId,obj: any) => {
  try {
    const resp = await DocumentModel.findByIdAndUpdate(docId,obj);
    return resp;
  } catch (err) {
    console.error("saving to db error", err);
    throw new Error("Saving to DB Error");
  }
};


export const getAllDocument = async (userId: string) => {
  try {
    
    const resp = await DocumentModel.find({ userId,status:"ready" }).sort({ createdAt: -1 });;
    return resp;
  } catch (err) {
    console.error("fetching from db error", err);
    throw new Error("Fetching from DB Error");
  }
};

export const getDocumentById = async (userId: string,documentId:string) => {
  try {
    
   const resp = await DocumentModel.findOne({
      _id: documentId, 
      userId: userId,                      
    });

    return resp;
  } catch (err) {
    console.error("fetching from db error", err);
    throw new Error("Fetching from DB Error");
  }
};


export const deleteDocumentById = async (userId: string,documentId:string) => {
  try {
    
   const resp = await DocumentModel.deleteOne({
      _id: documentId, 
      userId: userId,                      
    });
   const historyResp= await deleteChatHistory(userId,documentId)
   console.log(historyResp,"nigga")
    return resp;
  } catch (err) {
    console.error("deleting from db error", err);
    throw new Error("Deleting from DB Error");
  }
};