import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3000;

// Security and optimization middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 