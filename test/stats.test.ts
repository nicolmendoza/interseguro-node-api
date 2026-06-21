import { describe, expect, it } from '@jest/globals';
import { validateMatrices } from '../src/domain/matrix/matrix.validation.js';
import { calculateStats } from '../src/domain/stats/stats.service.js';

describe('calculateStats', () => {
  it('calcula maximo, minimo, promedio, suma y banderas diagonales', () => {
    const result = calculateStats([
      [
        [1, 0],
        [0, 2],
      ],
      [[3, 4]],
    ]);

    expect(result.max).toBe(4);
    expect(result.min).toBe(0);
    expect(result.average).toBe(1.6666666667);
    expect(result.sum).toBe(10);
    expect(result.hasDiagonalMatrix).toBe(true);
    expect(result.diagonalMatrices).toEqual([
      { index: 0, isDiagonal: true },
      { index: 1, isDiagonal: false },
    ]);
  });
});

describe('validateMatrices', () => {
  it('rechaza matrices irregulares', () => {

    const result = validateMatrices([[[1], [2, 3]]]);

    if (result.valid) {
      throw new Error('Se esperaba una validacion fallida');
    }

    expect(result.error).toMatch(/debe ser rectangular/);
  });
});


describe('validateMatrices', () => {
  it('acepta matrices rregulares', () => {

    const result = validateMatrices([[[1,4], [2, 3]]]);

    if (!result.valid) {
      throw new Error('Se esperaba una validacion exitosa');
    }

    expect(result.valid).toBe(true);
  });
});