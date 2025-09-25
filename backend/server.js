// server.js
import express from "express";
import bodyParser from "body-parser";
import { spawn } from "child_process";
import admin from "firebase-admin";
import dotenv from "dotenv";

// Load environment variables (for Firebase credentials etc.)
dotenv.config();

// Firebase Admin SDK initialization
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // make sure GOOGLE_APPLICATION_CREDENTIALS env set
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // e.g. "your-project.appspot.com"
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.send("Pushup Analyzer Backend is running 🚀");
});

// Analyze route
app.post("/analyze", async (req, res) => {
  const { videoURL, userId } = req.body;
  if (!videoURL) {
    return res.status(400).json({ error: "No videoURL provided" });
  }

  try {
    console.log(`Starting analysis for user: ${userId}, video: ${videoURL}`);

    // Run Python script
    const python = spawn("python3", ["analyze.py", videoURL]);

    let result = "";
    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`[Python Error]: ${data}`);
    });

    python.on("close", async (code) => {
      console.log(`Python process exited with code ${code}`);

      let pushupCount = 0;
      try {
        pushupCount = parseInt(result.trim(), 10);
        if (isNaN(pushupCount)) pushupCount = 0;
      } catch (err) {
        console.error("Error parsing pushup count:", err);
      }

      // Save to Firestore
      await db.collection("pushupReports").add({
        userId: userId || "guest",
        videoURL,
        pushupCount,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Pushup count saved: ${pushupCount}`);
      res.json({ success: true, pushupCount });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './src/db.js';
// import authRoutes from './src/routes/auth.js';

// dotenv.config();

// // ✅ Connect to MongoDB
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 3002;

// // ✅ Middlewares
// app.use(cors());
// app.use(express.json());

// // ✅ Routes
// app.use('/api/auth', authRoutes);

// // ✅ Health Check Route
// app.get('/', (_, res) => {
//   res.json({ message: 'Fitness App Backend API' });
// });

// // ✅ Server Listen on 0.0.0.0 (important for Expo/phone access)
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on http://0.0.0.0:${PORT}`);
// });
