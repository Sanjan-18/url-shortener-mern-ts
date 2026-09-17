import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import urlRoutes from "./routes/urlRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/urls", urlRoutes);
app.use("/api/r", redirectRoutes);

async function start() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/urlshortener"
    );
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

start();
