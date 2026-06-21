import { validateMatrices } from '../../domain/matrix/matrix.validation.js';
import type { Matrix } from '../../domain/matrix/matrix.types.js';
import { calculateStats } from '../../domain/stats/stats.service.js';
import type { CalculateMatrixStatsResult } from './calculateMatrixStats.types.js';

export function calculateMatrixStatsUseCase(matrices: unknown): CalculateMatrixStatsResult {
  
  const validation = validateMatrices(matrices);

  if (!validation.valid) {
    return {
      ok: false,
      error: validation.error,
    };
  }

  return {
    ok: true,
    stats: calculateStats(matrices as Matrix[]),
  };
}
