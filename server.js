const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const authRoutes = require('./routes/auth');
const mathRoutes = require('./routes/math');
const searchRoutes = require('./routes/search');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/math', mathRoutes);
app.use('/api/search', searchRoutes);
// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 E-commerce NLP Search API is running!',
    version: '1.0.0',
    endpoints: {
      smartSearch: 'POST /api/search/smart-search',
      allProducts: 'GET /api/search/all-products',
      categorySearch: 'GET /api/search/category/:category'
    },
    examples: [
      'comfortable running shoes under $100',
      'red dress for wedding party',
      'macbook for college student',
      'wireless headphones for gym',
      'nike shoes for men'
    ]
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'E-commerce NLP Search API',
    description: 'Natural language product search using Gemini AI',
    version: '1.0.0',
    documentation: {
      smartSearch: {
        method: 'POST',
        endpoint: '/api/search/smart-search',
        body: { query: 'your natural language search query' },
        example: { query: 'comfortable running shoes under $100' }
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /api',
      'POST /api/search/smart-search',
      'GET /api/search/all-products',
      'GET /api/search/category/:category',
      'POST /api/math/sum'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('📊 Database connection closed');
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log('🚀 Server started successfully!');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`🔍 Smart Search: http://localhost:${PORT}/api/search/smart-search`);
    console.log('📝 Ready to process natural language queries!');
    console.log('\n💡 Example queries to try:');
    console.log('  - "comfortable running shoes under $100"');
    console.log('  - "red dress for wedding party"');
    console.log('  - "macbook for college student"');
    console.log('  - "wireless headphones for gym"');
    console.log('  - "nike shoes for men"\n');
  });
};

startServer();
