const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KrishiLink Test Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test auth route
app.post('/api/auth/register', (req, res) => {
  console.log('Registration request:', req.body);
  res.json({ 
    message: 'Test registration endpoint working',
    received: req.body
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Test at: http://localhost:${PORT}/api/health`);
});
