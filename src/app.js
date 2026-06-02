const express = require('express');

function createApp() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/sum', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);

    if (Number.isNaN(a) || Number.isNaN(b)) {
      return res.status(400).json({ error: 'a e b devem ser numeros' });
    }

    return res.status(200).json({ result: a + b });
  });

  // Le configuracoes nao sensiveis vindas de variaveis de ambiente.
  // Em CI, sao fornecidas via `vars` do GitHub Actions.
  app.get('/info', (_req, res) => {
    res.status(200).json({
      env: process.env.APP_ENV || 'local',
      version: process.env.APP_VERSION || 'dev'
    });
  });

  // Endpoint protegido: o token vem de uma variavel de ambiente sensivel.
  // Em CI, e fornecido via `secrets` do GitHub Actions.
  app.get('/admin', (req, res) => {
    const expected = process.env.API_TOKEN;
    const received = req.header('x-api-token');

    if (!expected || received !== expected) {
      return res.status(401).json({ error: 'token invalido' });
    }

    return res.status(200).json({ message: 'acesso autorizado' });
  });

  return app;
}

module.exports = { createApp };
