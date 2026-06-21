export type MatrixStats = {
  max: number;
  min: number;
  average: number;
  sum: number;
  diagonalMatrices: Array<{
    index: number;
    isDiagonal: boolean;
  }>;
  hasDiagonalMatrix: boolean;
};
