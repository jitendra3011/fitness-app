import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/db.js';
import authRoutes from './src/routes/auth.js';

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3002;

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Health Check Route
app.get('/', (_, res) => {
  res.json({ message: 'Fitness App Backend API' });
});

// ✅ Server Listen on 0.0.0.0 (important for Expo/phone access)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
