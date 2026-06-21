import { describe, expect, it } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../src/transport/http/app.js';

describe('POST /stats', () => {
  const jwtSecret = 'test-secret';
  const app = createApp({
    jwtSecret,
    nodeApiUrl: 'http://node-api-test.com',
  });

  it('requiere JWT', async () => {
    const response = await request(app).post('/stats').send({ matrices: [[[1,8], [2, 3]]] });

    expect(response.status).toBe(401);
  });

  it('devuelve estadisticas de las matrices', async () => {
    
    const token = jwt.sign({ sub: 'test' }, jwtSecret);

    const response = await request(app)
      .post('/stats')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matrices: [
          [
            [9, 0],
            [0, 9],
          ],
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.max).toBe(9);
    expect(response.body.min).toBe(0);
    expect(response.body.hasDiagonalMatrix).toBe(true);
  });
});
