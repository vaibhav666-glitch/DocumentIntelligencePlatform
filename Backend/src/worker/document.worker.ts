import { Worker } from "bullmq";
import IORedis from "ioredis";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { pub } from "../utils/redis";
import { DocumentModel } from "../models/document.model";
import { processDocumentWithLangchain } from "../services/langchain.service";
import PptxParser from "node-pptx-parser";
import fs from "fs";
import path from "path";
import os from "os";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

function classifyError(error: any) {
  const msg = error?.message?.toLowerCase() || "";

  if (msg.includes("unsupported") || msg.includes("ppt format")) {
    return "UNSUPPORTED_FILE";
  }

  if (msg.includes("no text") || msg.includes("empty_document")) {
    return "EMPTY_DOCUMENT";
  }

  if (msg.includes("invalid") || msg.includes("corrupt")) {
    return "CORRUPTED_FILE";
  }

  if (msg.includes("network") || msg.includes("fetch")) {
    return "NETWORK_ERROR";
  }

  return "UNKNOWN";
}

function isRetryable(reason: string) {
  return ["NETWORK_ERROR", "UNKNOWN"].includes(reason);
}

export const documentWorker = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Worker MongoDB connected");

    new Worker(
      "document-queue",
      async (job) => {
        const { fileUrl, documentId, userId } = job.data;

        
        await DocumentModel.findByIdAndUpdate(documentId, {
          $inc: { attempts: 1 },
          lastAttemptAt: new Date(),
        });

        try {
          const response = await fetch(fileUrl);
          if (!response.ok) throw new Error("NETWORK_ERROR");

          const buffer = Buffer.from(await response.arrayBuffer());

          let text = "";

          if (fileUrl.endsWith(".pdf")) {
            const data = await pdfParse(buffer);
            text = data.text;
          } else if (fileUrl.endsWith(".docx")) {
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
          } 
        else if (fileUrl.endsWith(".pptx")) {
        const tempPath = path.join(os.tmpdir(), `${Date.now()}.pptx`);
          fs.writeFileSync(tempPath, buffer);

        console.log("tempPath", tempPath);

  // parse pptx
  const parser = new PptxParser(tempPath);
       const slides = await parser.extractText();

    text = slides
      .map((slide: any) => {
        const content = Array.isArray(slide.text) ? slide.text.join(" ") : "";
        return `Slide ${slide.id}: ${content}`;
      })
      .join("\n\n");

  console.log("am text ",text)

  fs.unlinkSync(tempPath);
}
          
          else if (fileUrl.endsWith(".ppt")) {
            throw new Error("UNSUPPORTED_FILE");
          } else {
            throw new Error("UNSUPPORTED_FILE");
          }

          if (!text || text.trim().length === 0) {
            throw new Error("EMPTY_DOCUMENT");
          }

         
          await processDocumentWithLangchain(text, userId, documentId);

         
          await DocumentModel.findByIdAndUpdate(documentId, {
            status: "ready",
            errorMessage: null,
            failureReason: null,
          });

          await pub.publish(
            "document-status",
            JSON.stringify({
              userId,
              documentId,
              status: "ready",
              failureReason: null
            })
          );

        } catch (error: any) {
          const reason = classifyError(error);

          console.error("Worker error:", error.message);

          if (!isRetryable(reason)) {
            await DocumentModel.findByIdAndUpdate(documentId, {
              status: "failed",
              errorMessage: error.message,
              failureReason: reason,
            });

            await pub.publish(
              "document-status",
              JSON.stringify({
                userId,
                documentId,
                status: "failed",
                failureReason: reason,
              })
            );

            return; 
          }

         
          if (job.attemptsMade + 1 >= job.opts.attempts!) {
            await DocumentModel.findByIdAndUpdate(documentId, {
              status: "failed",
              errorMessage: error.message,
              failureReason: reason,
            });

            await pub.publish(
              "document-status",
              JSON.stringify({
                userId,
                documentId,
                status: "failed",
                failureReason: reason,
              })
            );
          }

          throw error; 
        }
      },
      { connection }
    );
  } catch (err) {
    console.error("Worker startup error:", err);
  }
};

documentWorker();