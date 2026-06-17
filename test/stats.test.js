import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateStats, validateMatrices } from '../src/domain/stats.js';

describe('calculateStats', () => {
  it('calculates max, min, average, sum and diagonal flags', () => {
    const result = calculateStats([
      [
        [1, 0],
        [0, 2],
      ],
      [[3, 4]],
    ]);

    assert.equal(result.max, 4);
    assert.equal(result.min, 0);
    assert.equal(result.average, 1.6666666667);
    assert.equal(result.sum, 10);
    assert.equal(result.hasDiagonalMatrix, true);
    assert.deepEqual(result.diagonalMatrices, [
      { index: 0, isDiagonal: true },
      { index: 1, isDiagonal: false },
    ]);
  });
});

describe('validateMatrices', () => {
  it('rejects ragged matrices', () => {
    const result = validateMatrices([[[1], [2, 3]]]);

    assert.equal(result.valid, false);
    assert.match(result.error, /rectangular/);
  });
});
