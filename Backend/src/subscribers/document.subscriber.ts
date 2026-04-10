import { sub } from "../utils/redis";
import { getIO } from "../utils/socket";

export const startDocumentSubscriber = () => {
  const io = getIO();

  sub.subscribe("document-status", (err) => {
    if (err) {
      console.error("Redis subscribe error:", err);
    } else {
      console.log("Subscribed to document-status channel ");
    }
  });

  sub.on("message", (channel, message) => {
    if (channel === "document-status") {
      const data = JSON.parse(message);

      console.log("Received from worker:", data);

      
      io.to(data.userId).emit("document-status", {
        documentId: data.documentId,
        status: data.status,
        failureReason:data.failureReason
      });
    }
  });
};