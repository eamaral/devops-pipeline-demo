### Conventional Commits


### **Exemplos de prefixos**

- `feat:` nova funcionalidade
- `fix:` correção
- `chore:` manutenção
- `refactor:` refatoração
- `docs:` documentação
- `test:` testes

### **Exemplos didáticos**

```
feat: add user profile endpoint
fix: handle null payment response
docs: update pipeline setup instructions
```

### **Por que isso ajuda**

- histórico mais legível
- facilita changelog
- facilita release notes
- ajuda automação de versionamento

---

### **3.2 Semantic Versioning (SemVer)**

### **Explicação simples**

- **MAJOR** = quebra compatibilidade
- **MINOR** = nova funcionalidade compatível
- **PATCH** = correção compatível

### **Exemplo para explicar**

Se a aplicação estava em `2.3.4`:

- correção pequena → `2.3.5`
- nova feature compatível → `2.4.0`
- mudança que quebra contrato → `3.0.0`

### **Mensagem importante**

- versão comunica risco de mudança
- versionamento ajuda consumidor e time interno

### **Analogia**

> “Versionar bem é como rotular corretamente uma caixa antes de entregar.
> 
> 
> Quem recebe consegue entender melhor o impacto do que está chegando.”
> 

### **Erro comum / confusão comum**

**Confusão:** “Commit padronizado é burocracia.”

**Correção:** quando bem usado, ele reduz fricção e melhora automação.

---

## Code Review, proteção de branch e merge strategies**

### **O que um bom review ajuda a capturar**

- inconsistência de design
- risco técnico
- código confuso
- lacunas de teste
- decisões de implementação questionáveis

### **O que ele também promove**

- alinhamento técnico
- mentoria implícita
- disseminação de contexto

---

### Branch protection rules**

### **Itens comuns**

- required checks
- required approvals
- bloqueio de push direto
- exigência de branch atualizada
- status checks obrigatórios


> “Branch protegida é governança, não burocracia.”
> 

### **Explicação**

A branch principal costuma representar o caminho mais confiável do código.

Proteger essa branch é uma forma de preservar previsibilidade e disciplina do time.

---

### Merge strategies** 

### **Principais estratégias**

- **merge commit**
- **squash merge**
- **rebase merge**


### **Erro comum / confusão comum**

**Confusão:** “Se tem revisão, não preciso proteger branch.”

**Correção:** revisão sem política de proteção vira acordo informal; proteção transforma acordo em padrão operacional.

## Quality Gates

### **Exemplos de gates**

- lint obrigatório
- cobertura mínima
- SonarQube
- vulnerabilidades críticas
- testes obrigatórios
- política mínima de aprovação

### **Mensagem importante**

- gate não é castigo
- gate é guardrail
- gate ajuda a manter padrão mínimo

### **Exemplo de explicação prática**

> “Sem gate, a qualidade vira uma conversa subjetiva.
> 
> 
> Com gate, existe um mínimo claro para seguir em frente.”
> 

### **Exemplo de mundo real**

Se a política do time define cobertura mínima, checks obrigatórios e ausência de vulnerabilidade crítica, isso reduz espaço para decisões improvisadas de última hora.