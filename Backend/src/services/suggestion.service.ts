import Groq from "groq-sdk";
import { MongoClient } from "mongodb";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import dotenv from "dotenv";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
dotenv.config();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const client = new MongoClient(process.env.MONGO_URI!);

export const getInitialSuggestions = async (
  userId: string,
  documentId: string
) => {
  await client.connect();

  const collection = client.db().collection("embeddings");

  const docs = await collection
    .find({
      userDocKey: `${userId}_${documentId}`,
    })
    .limit(10)
    .toArray();

  if (!docs.length) {
    return [];
  }

  const context = docs
    .map((d) => d.text)
    .join("\n")
    .slice(0, 3000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
     content: `
Generate EXACTLY 5 questions from the given text.

STRICT FORMAT:
- Only plain questions
- One question per line
- No bullets, no numbering
- No extra words
- No intro or outro text
Return ONLY valid JSON:
["question1", "question2", "question3", "question4", "question5"]
If you add anything else, the output is invalid.
`,
      },
      {
        role: "user",
        content: context,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "";

  
  const suggestions = raw
    .split("\n")
    .map((q) =>
      q
        .replace(/^[-•*\d.\s]+/, "") // remove bullets, numbers
        .trim()
    )
    .filter((q) => q.length > 0);

  return suggestions;
};

export const getFollowUpSuggestions = async (
  userId: string,
  documentId: string,
  question: string,
  answer: string
) => {
  await client.connect();

  const collection = client.db().collection("embeddings");

  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HF_API_KEY!,
  });

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  
  const docs = await vectorStore.similaritySearch(question, 5, {
    userDocKey: `${userId}_${documentId}`,
  });

  const context = docs
    .map((d) => d.pageContent)
    .join("\n")
    .slice(0, 2000);

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: `
Based on the question, answer, and context, generate 4 relevant follow-up questions.

 STRICT FORMAT:
- Only plain questions
- Do NOT repeat the original question
- Make them deeper or related
- Keep them short
- One question per line
- No bullets, no numbering
- No extra words
- No intro or outro text
Return ONLY valid JSON:
["question1", "question2", "question3", "question4", "question5"]
If you add anything else, the output is invalid.
`
      },
      {
        role: "user",
        content: `
Context:
${context}

Question:
${question}

Answer:
${answer}
        `,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content || "";

  const suggestions = raw
    .split(/\n|\r/)
    .map((q) =>
      q
        .replace(/^[-•*\d.\)\s]+/, "")
        .trim()
    )
    .filter((q) => q.length > 5);

  return suggestions;
};