import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { calculateStats, validateMatrices } from '../domain/stats.js';
import { createOpenApiSpec } from '../openapi.js';
import { authenticate } from './auth.js';

export function createApp({ jwtSecret, goApiUrl, nodeApiUrl }) {
  if (!jwtSecret) {
    throw new Error('jwtSecret is required');
  }
  if (!goApiUrl) {
    throw new Error('goApiUrl is required');
  }
  if (!nodeApiUrl) {
    throw new Error('nodeApiUrl is required');
  }

  const app = express();
  const openApiSpec = createOpenApiSpec({ goApiUrl, nodeApiUrl });

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'node-api' });
  });

  app.post('/stats', authenticate(jwtSecret), (req, res) => {
    const { matrices } = req.body;
    const validation = validateMatrices(matrices);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    return res.json(calculateStats(matrices));
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'route not found' });
  });

  return app;
}
