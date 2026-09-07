import express from 'express';
import dotenv from 'dotenv';
import { generateCodeWithLLM, fetchBAiModels } from '../server/ai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '25mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', environment: 'vercel-serverless', timestamp: new Date().toISOString() });
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const result = await generateCodeWithLLM(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error en generación de código' });
  }
});

app.post('/api/ai/b_ai/models', async (req, res) => {
  try {
    const { apiKey } = req.body;
    const models = await fetchBAiModels(apiKey);
    res.json({ success: true, models });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default app;
