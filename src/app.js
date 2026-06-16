import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapi.js';
import { calculateStats, validateMatrices } from './stats.js';

export function createApp({ jwtSecret = 'interseguro-secret' } = {}) {
  const app = express();

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

function authenticate(jwtSecret) {
  return (req, res, next) => {
    const header = req.get('Authorization') ?? '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'missing bearer token' });
    }

    try {
      jwt.verify(token, jwtSecret);
      return next();
    } catch {
      return res.status(401).json({ error: 'invalid token' });
    }
  };
}
