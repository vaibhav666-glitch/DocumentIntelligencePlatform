import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import app from "./app";
import { initSocket } from "./utils/socket"; // adjust path if needed
import { startDocumentSubscriber } from "./subscribers/document.subscriber";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB Connected");

    const server = http.createServer(app);


    initSocket(server);

    startDocumentSubscriber()
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server Error:", error);
    process.exit(1);
  }
};

startServer();