# devops-pipeline-demo

Projeto de exemplo para a aula de **DevOps: CI, Continuous Delivery e Continuous Deployment**.

A ideia aqui não é impressionar com complexidade, e sim **materializar** o pipeline mínimo que entrega valor quando é **confiável**.

> "Pipeline não é uma sequência aleatória de passos. Pipeline é um **funil de confiança**.
> Cada etapa existe para aumentar nossa confiança antes da próxima promoção."

---

## O que tem nesse repo

Uma API Node.js mínima (Express) com duas rotas:

- `GET /health` — health-check
- `GET /sum?a=1&b=2` — soma dois números (com validação)

E um pipeline de CI no GitHub Actions que executa, em ordem:

1. **Checkout do código** — baixa a versão a ser validada
2. **Instalação de dependências** — prepara o ambiente
3. **Lint** (ESLint) — valida padrões de qualidade
4. **Testes** (Jest + Supertest) — valida comportamento esperado
5. **Geração de artefato** — produz algo promovível (`dist/`)
6. **Publicação do artefato** — sobe como artifact do GitHub Actions

O workflow vive em [.github/workflows/ci.yml](.github/workflows/ci.yml).

---

## Como rodar localmente

```bash
npm ci          # instala dependências
npm run lint    # roda o ESLint
npm test        # roda os testes com cobertura
npm run build   # gera artefato em ./dist
npm start       # sobe a API em http://localhost:3000
```

---

## Mapeando com os conceitos da aula

### CI — Integração Contínua

> CI não é ter um servidor de build. CI é **disciplina de integração frequente com validação automática**.

Neste repo, isso aparece como:

- Workflow dispara em **todo push** e **toda PR** contra `main`
- Cada PR é validada pelo mesmo pipeline antes do merge
- Feedback rápido: lint e testes falham cedo, antes do artefato

### Continuous Delivery vs Continuous Deployment

| | Delivery | Deployment |
|---|---|---|
| Validação automática | ✅ | ✅ |
| Artefato pronto pra publicar | ✅ | ✅ |
| Decisão humana antes de prod | ✅ | ❌ |
| Publicação em prod automática | ❌ | ✅ |

> "Delivery é: o botão de deploy está pronto.
> Deployment é: o botão foi apertado automaticamente."

Este repo está no nível **CI**. Para evoluir para **Delivery**, daria pra adicionar um workflow de release com aprovação manual usando GitHub Environments. Para **Deployment**, esse mesmo workflow rodaria sem o gate manual.

---

## Takeaways

- **CI** reduz o risco da integração.
- **Delivery** reduz o atrito da publicação.
- **Deployment** automatiza a publicação até produção.
- O objetivo do pipeline **não é impressionar** — é **validar cedo, rápido e com previsibilidade**.
