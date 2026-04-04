import express from "express";
import cors from "cors"
import authRoutes from "./routes/auth.routes";
// import tripRoutes  from "./routes/trip.routes";
// import aiRoutes from "./routes/ai.routes";

import { errorHandler } from "./middleware/error.middleware";
const app = express();


app.use(cors());
app.use(express.json());

app.use(errorHandler)
app.use("/api/auth", authRoutes);
// app.use("/api/trips", tripRoutes);
// app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;