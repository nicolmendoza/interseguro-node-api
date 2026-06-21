import type { RequestHandler } from 'express';
import { calculateMatrixStatsUseCase } from '../../../application/stats/calculateMatrixStatsUseCase.js';
import type { StatsRequest } from '../dto/stats.request.js';

export const calculateStatsHandler: RequestHandler<unknown, unknown, StatsRequest> = (req, res) => {
  
  const result = calculateMatrixStatsUseCase(req.body.matrices);

  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  return res.json(result.stats);
};
