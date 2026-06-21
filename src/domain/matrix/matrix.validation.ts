import type { Matrix, ValidationResult } from './matrix.types.js';

function validateMatrix(matrix: unknown, matrixIndex: number): ValidationResult {
  
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return { valid: false, error: `la matriz ${matrixIndex} debe contener al menos una fila` };
  }

  if (!Array.isArray(matrix[0]) || matrix[0].length === 0) {
    return { valid: false, error: `la matriz ${matrixIndex} debe contener al menos una columna` };
  }

  const columns = matrix[0].length;
  
  for (const [rowIndex, row] of matrix.entries()) {
    if (!Array.isArray(row) || row.length !== columns) {
      return {
        valid: false,
        error: `la matriz ${matrixIndex} debe ser rectangular: todas sus filas deben tener la misma cantidad de columnas`,
      };
    }
    for (const value of row) {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        return {
          valid: false,
          error: `la matriz ${matrixIndex}, fila ${rowIndex}, contiene un valor que no es un numero finito`,
        };
      }
    }
  }

  return { valid: true };
}


export function validateMatrices(matrices: unknown): ValidationResult {

  if (!Array.isArray(matrices) || matrices.length === 0) {
    return { valid: false, error: 'matrices debe ser un arreglo no vacio' };
  }

  for (const [matrixIndex, matrix] of matrices.entries()) {
    const validation = validateMatrix(matrix, matrixIndex);
    if (!validation.valid) {
      return validation;
    }
  }

  return { valid: true };
}

export function assertMatrices(matrices: unknown): asserts matrices is Matrix[] {

  const validation = validateMatrices(matrices);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

}
