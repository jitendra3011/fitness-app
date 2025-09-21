import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use a local MongoDB connection for development
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-app';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing without database connection for development...');
  }
};

export default connectDB;