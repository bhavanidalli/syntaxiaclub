import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: "*" }));

// Parse JSON request bodies
app.use(bodyParser.json());

// Setup path utilities for file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// Registration Schema
const Registration = mongoose.model(
  "Registration",
  new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    year: String,
    interest: String,
  })
);

// Feedback Schema
const Feedback = mongoose.model(
  "Feedback",
  new mongoose.Schema({
    name: String,    email: String,
    type: String,
    rating: Number,
    feedback: String,
  })
);

// API Routes
app.post("/register", async (req, res) => {
  try {
    const saved = await Registration.create(req.body);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.post("/feedback", async (req, res) => {
  try {
    const saved = await Feedback.create(req.body);
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Root route: Serve your HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../html1.html"));
});

// DO NOT INCLUDE STATIC SERVING FOR ROOT:
// Remove or comment out any line like: 
// app.use(express.static(path.join(__dirname, "../")));

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
