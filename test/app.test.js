const request = require('supertest');
const { createApp } = require('../src/app');

describe('devops-pipeline-demo API', () => {
  const app = createApp();

  test('GET /health responde 200 com status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /sum soma dois numeros', async () => {
    const res = await request(app).get('/sum').query({ a: 2, b: 3 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: 5 });
  });

  test('GET /sum retorna 400 para entradas invalidas', async () => {
    const res = await request(app).get('/sum').query({ a: 'x', b: 3 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
