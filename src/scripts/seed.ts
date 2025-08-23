import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from '../data/seedData';

dotenv.config();

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishilink');
    console.log('Connected to MongoDB');
    
    await seedDatabase();
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed script error:', error);
    process.exit(1);
  }
}

runSeed();
