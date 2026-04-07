import Groq from "groq-sdk";
import { retrieveRelevantChunks } from "./retrieval.service";
import { ChatModel } from "../models/chat.model";
import * as chatRepo from "../repository/chat.repository";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export const askQuestionService = async (
  userId: string,
  documentId: string,
  question: string
) => {
  
  const rawResults = await retrieveRelevantChunks(
    question,
    userId,
    documentId
  );

  if (!rawResults || rawResults.length === 0) {
    return {
      answer: "I don't have enough information in the document.",
      sources: [],
    };
  }

  const chunks = rawResults.slice(0, 5);

  const context = chunks
    .map((doc, i) => `Chunk ${i + 1}:\n${doc.pageContent}`)
    .join("\n\n");


  const history = await ChatModel.find({
    userId,
    documentId,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const formattedHistory = history
    .reverse()
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

  const messages = [
    {
      role: "system",
      content: `
You are a strict document assistant.
Answer ONLY from context.
If not found, say "I don't know based on the document."
      `,
    },
    ...formattedHistory,
    {
      role: "user",
      content: `Context:\n${context}\n\nQuestion:\n${question}`,
    },
  ];

  try {
   
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
    });

    const fullAnswer =
      completion.choices[0]?.message?.content || "No response";

   
    await chatRepo.createChat([
      { userId, documentId, role: "user", content: question },
      { userId, documentId, role: "assistant", content: fullAnswer },
    ]);

   
    return {
      answer: fullAnswer,
      sources: chunks.map((c, i) => ({
        chunk: i + 1,
        preview: c.pageContent.slice(0, 200),
      })),
    };

  } catch (err: any) {
    console.error("Error:", err.message);

    throw new Error("System is busy. Please try again.");
  }
};