import * as documentRepo from "../repository/document.repository";
import { getIO } from "../utils/socket";
import { documentQueue } from "../queues/document.queue";

export const postDocumentService = async (data: any) => {
  let doc=null;
  try {
   
     doc = await documentRepo.postDocument({
      ...data,
      status: "processing",
      attempts: 0,
      errorMessage: null,
      failureReason: null,
    });

    const io = getIO();

    // 2️⃣ Emit initial status
    io.to(data.userId.toString()).emit("document-status", {
      documentId: doc._id,
      status: "processing",
    });

    // 3️⃣ Add job with retry config 🔥
    await documentQueue.add(
      "process-document",
      {
        documentId: doc._id,
        fileUrl: doc.fileUrl,
        userId: data.userId,
      },
      {
        attempts: 3, // retry 3 times
        backoff: {
          type: "exponential",
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false, // keep failed jobs for debugging
      }
    );

    return doc;

  } catch (err: any) {
  console.error("Service Error:", err);

  if (doc?._id) {
    await documentRepo.updateDocument(doc._id, {
      status: "failed",
      errorMessage: "Failed to enqueue document for processing",
      failureReason: "UNKNOWN",
    });
  }

  throw new Error(err.message);
}
};