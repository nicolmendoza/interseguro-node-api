import type { MatrixStats } from '../../domain/stats/stats.types.js';

type CalculateMatrixStatsSuccess = {
  ok: true;
  stats: MatrixStats;
};

type CalculateMatrixStatsFailure = {
  ok: false;
  error: string;
};

export type CalculateMatrixStatsResult = CalculateMatrixStatsSuccess | CalculateMatrixStatsFailure;
