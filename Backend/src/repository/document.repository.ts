import { DocumentModel } from "../models/document.model";

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