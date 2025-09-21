import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/db.js';
import authRoutes from './src/routes/auth.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Use auth routes
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (_, res) => {
  res.json({ message: 'Fitness App Backend API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});