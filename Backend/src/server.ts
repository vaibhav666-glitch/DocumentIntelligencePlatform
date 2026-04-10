import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import app from "./app";
import { initSocket } from "./utils/socket";
import { startDocumentSubscriber } from "./subscribers/document.subscriber";

dotenv.config();

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const server = http.createServer(app);

    initSocket(server);
    startDocumentSubscriber();

    const PORT = process.env.PORT || 5000;
console.log("ENV PORT:", process.env.PORT);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server Error:", error);
    process.exit(1);
  }
};

startServer();