import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://vishu241.github.io',
    'https://ad-generator-kzt1.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', apiRoutes);

// Health check (also available at root level)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', ai: 'Gemini 1.5 Flash' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Ad Generator running on http://localhost:${PORT}`);
  console.log('📖 Endpoints:');
  console.log('   POST /api/process - Process URL and insert ads');
  console.log('   POST /api/preview - Generate HTML preview');
  console.log('   GET  /api/preview - Generate HTML preview (with URL param)');
  console.log('   POST /api/summarize - Generate AI summary with one ad');
  console.log('   GET  /health - Health check');
});