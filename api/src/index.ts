import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import { connectToMongoDB } from './db/mongodb';

const app = express();
const port = process.env.PORT || 3000;

// Security and optimization middleware
app.use(helmet());
const allowedOrigins = [
  'https://preview.noteprism.com',
  'https://noteprism.com',
  'https://www.noteprism.com'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(compression());
app.use(express.json());

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Initialize MongoDB connection and start server
connectToMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }); 
