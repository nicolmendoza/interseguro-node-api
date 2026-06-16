import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('POST /stats', () => {
  const jwtSecret = 'test-secret';
  const app = createApp({ jwtSecret });

  it('requires JWT', async () => {
    const response = await request(app).post('/stats').send({ matrices: [[[1]]] });

    assert.equal(response.status, 401);
  });

  it('returns matrix statistics', async () => {
    const token = jwt.sign({ sub: 'test' }, jwtSecret);

    const response = await request(app)
      .post('/stats')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matrices: [
          [
            [1, 0],
            [0, 1],
          ],
        ],
      });

    assert.equal(response.status, 200);
    assert.equal(response.body.max, 1);
    assert.equal(response.body.min, 0);
    assert.equal(response.body.hasDiagonalMatrix, true);
  });
});
