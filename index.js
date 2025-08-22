import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { port } from './config/env.js';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middlewares/error.js';

// Import routes
import healthRoutes from './routes/health.route.js';
import communityRoutes from './routes/community.route.js';
import marketplaceRoutes from './routes/marketplace.route.js';
import servicesRoutes from './routes/services.route.js';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KrishiLink API',
    version: '1.0.0'
  });
});

// Mount routes
app.use('/api/health', healthRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/services', servicesRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});
