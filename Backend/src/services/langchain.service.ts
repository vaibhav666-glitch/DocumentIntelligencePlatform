import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import dotenv from "dotenv";

dotenv.config();


const client = new MongoClient(process.env.MONGO_URI!);

export const processDocumentWithLangchain = async (
  text: string,
  userId: string,
  documentId: string
) => {
  try {
   
    const splitter = new RecursiveCharacterTextSplitter({
       chunkSize: 800,
       chunkOverlap: 150,
    });

  const cleanText = text.replace(/\s+/g, " ").trim();

const docs = await splitter.createDocuments([cleanText]);

const batchSize = 50;
  
   if (!client) {
       await client.connect();

      console.log("MongoClient connected (vector DB)");
    }

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

   
  for (let i = 0; i < docs.length; i += batchSize) {
  const batch = docs.slice(i, i + batchSize);

  await vectorStore.addDocuments(
    batch.map((doc, index) => ({
      pageContent: doc.pageContent,
      metadata: {
      userDocKey: `${userId}_${documentId}`,
        chunkIndex: i + index,
      },
    }))
  );
}

    console.log("Embeddings stored successfully ");

  } catch (error) {
    console.error("Langchain processing error:", error);
    throw error;
  }
};