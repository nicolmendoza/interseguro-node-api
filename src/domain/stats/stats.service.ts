import type { Matrix } from '../matrix/matrix.types.js';
import type { MatrixStats } from './stats.types.js';

export function calculateStats(matrices: Matrix[]): MatrixStats {

  const values = matrices.flat(2);
  const sum = values.reduce((total, value) => total + value, 0);

  return {
    max: Math.max(...values),
    min: Math.min(...values),
    average: round(sum / values.length),
    sum: round(sum),
    diagonalMatrices: matrices.map((matrix, index) => ({
      index,
      isDiagonal: isDiagonal(matrix),
    })),
    hasDiagonalMatrix: matrices.some(isDiagonal),
  };
}

function isDiagonal(matrix: Matrix): boolean {
  
  if (matrix.length !== matrix[0].length) {
    return false;
  }

  return matrix.every((row, rowIndex) =>
    row.every((value, columnIndex) => rowIndex === columnIndex || Math.abs(value) < 1e-10),
  );
}

function round(value: number): number {
  return Math.round(value * 1e10) / 1e10;
}
