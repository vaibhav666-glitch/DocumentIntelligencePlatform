import express from "express";
import cors from "cors"
import authRoutes from "./routes/auth.routes";
import documentRoutes from "./routes/document.routes"
import chatRoutes from "./routes/chat.routes"
import suggestionRoutes from "./routes/suggestion.routes"


import { errorHandler } from "./middleware/error.middleware";
const app = express();


app.use(cors());
app.use(express.json());

app.use(errorHandler)
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/suggestion", suggestionRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;