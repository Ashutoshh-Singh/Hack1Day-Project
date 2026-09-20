import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import healthRouter from './routes/health.js';
import schemesRouter from './routes/schemes.js';
import matchRouter from './routes/match.js';
import askRouter from './routes/ask.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// CORS configuration supporting local Vite and cloud deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed list, vercel/render domains, or any local dev
    const isAllowed = !process.env.NODE_ENV || 
                      process.env.NODE_ENV !== 'production' ||
                      allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      origin.endsWith('.onrender.com') ||
                      origin.includes('localhost') ||
                      origin.includes('127.0.0.1');
                      
    if (isAllowed || true) { // Permissive for public civic-tech API
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS policy.`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request body parser with 100kb limit
app.use(express.json({ limit: '100kb' }));

// Mount REST API Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Right2Know API Server',
    status: 'online',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      schemes: '/api/schemes',
      match: 'POST /api/match',
      ask: 'POST /api/ask'
    },
    message: 'To view the user interface, open the frontend web app at http://localhost:5173'
  });
});

app.use('/api/health', healthRouter);
app.use('/api/schemes', schemesRouter);
app.use('/api/match', matchRouter);
app.use('/api/ask', askRouter);

// Fallback 404 for unknown endpoints
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start server listening
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(` Right2Know API Server Running`);
    console.log(` Port: ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
  });
}

export default app;
