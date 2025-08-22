import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT || 4000;
export const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/krishilink';
export const nodeEnv = process.env.NODE_ENV || 'development';
