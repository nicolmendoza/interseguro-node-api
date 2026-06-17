export function validateMatrices(matrices) {
  if (!Array.isArray(matrices) || matrices.length === 0) {
    return { valid: false, error: 'matrices must be a non-empty array' };
  }

  for (const [matrixIndex, matrix] of matrices.entries()) {
    if (!Array.isArray(matrix) || matrix.length === 0) {
      return { valid: false, error: `matrix ${matrixIndex} must contain at least one row` };
    }
    if (!Array.isArray(matrix[0]) || matrix[0].length === 0) {
      return { valid: false, error: `matrix ${matrixIndex} must contain at least one column` };
    }

    const columns = matrix[0].length;
    for (const [rowIndex, row] of matrix.entries()) {
      if (!Array.isArray(row) || row.length !== columns) {
        return { valid: false, error: `matrix ${matrixIndex} must be rectangular` };
      }
      for (const value of row) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
          return { valid: false, error: `matrix ${matrixIndex}, row ${rowIndex} contains a non-finite number` };
        }
      }
    }
  }

  return { valid: true };
}

export function calculateStats(matrices) {
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

function isDiagonal(matrix) {
  if (matrix.length !== matrix[0].length) {
    return false;
  }

  return matrix.every((row, rowIndex) =>
    row.every((value, columnIndex) => rowIndex === columnIndex || Math.abs(value) < 1e-10),
  );
}

function round(value) {
  return Math.round(value * 1e10) / 1e10;
}
