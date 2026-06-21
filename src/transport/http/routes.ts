import type { Express } from 'express';
import { authenticate } from './middleware/authenticate.js';
import { calculateStatsHandler } from './handlers/stats.handler.js';

type RoutesDependencies = {
  jwtSecret: string;
};

export function registerRoutes(app: Express, { jwtSecret }: RoutesDependencies) {
  app.post('/stats', authenticate(jwtSecret), calculateStatsHandler);
}
