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

  test('GET /info devolve env e version a partir das variaveis de ambiente', async () => {
    process.env.APP_ENV = 'test';
    process.env.APP_VERSION = '1.2.3';

    const res = await request(createApp()).get('/info');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ env: 'test', version: '1.2.3' });
  });

  test('GET /admin retorna 401 quando o token nao bate', async () => {
    process.env.API_TOKEN = 'segredo-correto';

    const res = await request(createApp())
      .get('/admin')
      .set('x-api-token', 'token-errado');

    expect(res.status).toBe(401);
  });

  test('GET /admin retorna 200 quando o token bate', async () => {
    process.env.API_TOKEN = 'segredo-correto';

    const res = await request(createApp())
      .get('/admin')
      .set('x-api-token', 'segredo-correto');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'acesso autorizado' });
  });
});
