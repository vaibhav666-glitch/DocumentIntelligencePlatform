import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI!);

export const retrieveRelevantChunks = async (
  query: string,
  userId: string,
  documentId: string
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


 const results = await vectorStore.similaritySearch(query, 5, 
  {
    "userDocKey": `${userId}_${documentId}`,
  
});

  console.log("am results",results)
  return results;
};