import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Use fallback URI if environment variable is not set
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishilink';
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.log('💡 Make sure MongoDB is running on your system');
    console.log('💡 Or update MONGODB_URI in your .env file');
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
