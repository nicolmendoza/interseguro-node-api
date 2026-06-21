import type { RequestHandler } from 'express';

export const healthHandler: RequestHandler = (req, res) => {
  res.json({ status: 'ok', service: 'node-api' });
};
