# Auditoria-2 — Projeto AKMLEVA (beta-app)

**Repositório:** https://github.com/luismccampos-beep/beta-app  
**Data da auditoria:** Junho 2026  
**Auditor:** Claude (Anthropic)

---

## Índice

1. [Resumo Executivo](#1-resumo-executivo)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Pontos Fortes](#3-pontos-fortes)
4. [Problema Crítico — Segurança](#4-problema-crítico--segurança)
5. [Problemas a Resolver](#5-problemas-a-resolver)
6. [Sugestões de Melhoria](#6-sugestões-de-melhoria)
7. [Scorecard](#7-scorecard)
8. [Plano de Ação Prioritário](#8-plano-de-ação-prioritário)

---

## 1. Resumo Executivo

O AKMLEVA é uma plataforma enterprise de viagens com IA, desenvolvida em Next.js 15 / React 19 / TypeScript 5, com pipeline de dados geográficos sofisticado (Wikivoyage, Wikidata, Geonames, Overpass), ML service em Python, e infraestrutura de qualidade (Sentry, Playwright, Vitest, Storybook).

O projeto demonstra maturidade de engenharia notável para o seu estágio, com escolhas técnicas modernas e um pipeline de dados de profundidade pouco comum. Existe, no entanto, um **problema crítico de segurança** que requer ação imediata, e várias questões de organização do repositório que devem ser endereçadas antes de qualquer crescimento da equipa ou exposição pública.

---

## 2. Stack Tecnológico

### Frontend

| Tecnologia    | Versão         | Estado    |
|---------------|----------------|-----------|
| React         | ^19.0.0        | ✅ Atual   |
| Next.js       | ^15.5.2        | ✅ Atual   |
| TypeScript    | ^5.6.0         | ✅ Atual   |
| Tailwind CSS  | ^4.1.8         | ✅ Atual   |
| shadcn/ui     | via Radix UI   | ✅ Correto |
| Framer Motion | ^11.18.2       | ✅ Estável |

### Backend / Infra

| Tecnologia      | Versão       | Estado            |
|-----------------|--------------|-------------------|
| Prisma ORM      | 6.17.1       | ✅ Atual           |
| next-auth       | 5.0.0-beta.31| ⚠️ Beta            |
| Upstash Redis   | ^1.35.6      | ✅ Estável         |
| Sentry          | ^10.58.0     | ✅ Configurado     |
| ioredis         | ^5.3.2       | ✅ Estável         |
| zod             | ^4.1.12      | ✅ Atual           |

### Testing / Qualidade

| Ferramenta     | Versão    | Estado    |
|----------------|-----------|-----------|
| Vitest         | ^4.0.15   | ✅ Atual   |
| Playwright     | ^1.49.0   | ✅ Estável |
| Storybook      | ^10.4.6   | ✅ Presente|
| MSW            | ^2.12.7   | ✅ Correto |

### Linguagens do repositório

- TypeScript: 48.7%
- HTML: 23.9%
- JavaScript: 18.8%
- Python: 8.3%
- CSS: 0.2%
- Batchfile: 0.1%

---

## 3. Pontos Fortes

### Stack moderno e coerente

As versões utilizadas estão todas na vanguarda (React 19, Next.js 15 App Router, Tailwind 4). A escolha de shadcn/ui + Radix UI é a abordagem correta para acessibilidade nativa sem overhead de CSS customizado.

### Infraestrutura de observabilidade

O Sentry está configurado em três camadas — `sentry.client.config.ts`, `sentry.server.config.ts`, e `sentry.edge.config.ts` — cobrindo todos os runtimes do Next.js. Isto é frequentemente ignorado em projetos de estágio beta e é um sinal de maturidade.

### Pipeline de dados geográficos

O sistema de enriquecimento de destinos é genuinamente sofisticado:
- Extração de Wikivoyage (PT + EN) com dump parser em Python
- Geocodificação paralela com retoma automática em caso de interrupção
- Enriquecimento com múltiplas fontes: Geonames, Wikidata, Overpass, UNESCO, Google Maps
- Scripts de validação e verificação de qualidade de dados
- ML service separado para embeddings de destinos

### Estratégia de testes multi-camada

A presença de Vitest (unitários/integração) + Playwright (E2E) + MSW (mock de API) + Storybook (componentes isolados) indica uma estratégia de qualidade pensada. A flag `--changed` no Vitest para correr apenas testes afetados é um detalhe positivo para developer experience.

### Monorepo com Turbo

O uso de Turborepo com cache remoto (`TURBO_CACHE="remote:rw"`) e workspaces npm (`packages/*`) é a abordagem correta para um projeto desta escala.

### Segurança de rate limiting

A integração de `@upstash/ratelimit` indica consciência de segurança a nível de API.

---

## 4. Problema Crítico — Segurança

> ⚠️ **AÇÃO IMEDIATA NECESSÁRIA**

### Ficheiros `.env.prod` e `.env.prod2` expostos publicamente

Os ficheiros `.env.prod` e `.env.prod2` estão **comitados no repositório público**. Embora os valores das variáveis estejam maioritariamente vazios nesta versão, o ficheiro `.env.prod` contém:

- **Um token OIDC Vercel válido** (`VERCEL_OIDC_TOKEN`) — um JWT assinado com informação real do projeto
- O `project_id` Vercel (`prj_CQ51fgkHkh6n1rv732BQ6zhr2sKS`)
- O `owner_id` e `team_id` da conta Vercel
- A estrutura completa de todas as variáveis de ambiente de produção (nomes de variáveis de base de dados, chaves de API, etc.)
- Metadados do ambiente de deployment (URLs, branches, SHAs de commits)

Mesmo que os valores estejam vazios, expor a estrutura de variáveis facilita ataques direcionados.

### Plano de remediação (por ordem de execução)

**Passo 1 — Revogar o token exposto imediatamente**

Aceder ao dashboard Vercel → Settings → Tokens e revogar qualquer token associado ao projeto `beta-app`.

**Passo 2 — Remover os ficheiros do repositório**

```bash
git rm --cached .env.prod .env.prod2
git commit -m "chore: remove env files from version control"
git push
```

**Passo 3 — Limpar o histórico do git**

O `git rm` apenas remove dos commits futuros — os ficheiros continuam no histórico. Usar o BFG Repo-Cleaner:

```bash
# Instalar BFG
brew install bfg   # ou download do jar em rtyley.github.io/bfg-repo-cleaner

# Fazer clone espelho
git clone --mirror https://github.com/luismccampos-beep/beta-app.git

# Remover os ficheiros do histórico
bfg --delete-files .env.prod beta-app.git
bfg --delete-files .env.prod2 beta-app.git

# Limpar e fazer force push
cd beta-app.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

**Passo 4 — Atualizar o `.gitignore`**

Adicionar ao `.gitignore`:

```
# Environment files — NEVER commit these
.env
.env.local
.env.*.local
.env.prod
.env.prod2
.env.production
.env.staging
.env.development
```

**Passo 5 — Verificação**

Após os passos acima, verificar com:

```bash
git log --all --full-history -- .env.prod
# Não deve retornar resultados
```

---

## 5. Problemas a Resolver

### 5.1 Ficheiros de dados na raiz do repositório

**Problema:** Vários ficheiros CSV e JSON de dados estão na raiz do repositório:

```
export_hybrid_ENHANCED.csv
export_hybrid_FINAL_CORRIGIDO.csv
export_hybrid_review.csv
export_final_review.csv
export_dests_sem_coords.csv
export_pais_mismatches.csv
export_paiscode_mismatches.csv
export_remaining_dests.csv
lugares_reais_final.csv
wikivoyage_links.csv
wikivoyage_links.json
wikivoyage_links.html
wikivoyage_links.md
wikivoyage_cache.json
```

**Impacto:** Aumenta o tamanho do clone, polui a navegação do repositório, mistura artefactos de dados temporários com código de produto.

**Solução:** Mover para `/data/` (já existe esta pasta) e adicionar ao `.gitignore`. Dados de grande volume devem ser armazenados em storage externo (S3, R2, etc.) e referenciados por URL.

### 5.2 Artefactos de análise e diagnóstico na raiz

**Problema:** Ficheiros de análise temporária estão na raiz:

```
ENRICHMENT-SUMMARY.md
GEOCODING-SUMMARY.md
COMMIT_MSG.md
lighthouse-about.json
lighthouse-destinations.json
lighthouse-home.json
```

**Solução:**
- Summaries de processos → mover para `/docs/` ou remover
- Relatórios Lighthouse → mover para `/docs/lighthouse/` ou ignorar pelo git
- `COMMIT_MSG.md` → remover (os commits devem ser auto-explicativos)

### 5.3 Dependência de autenticação em beta

**Problema:** `next-auth@5.0.0-beta.31` em produção numa plataforma enterprise com dados de pagamento e clientes.

**Risco:** Mudanças de breaking entre versões beta, ausência de SLA de segurança, API instável.

**Solução:** Acompanhar o roadmap do Auth.js v5 e migrar para a versão estável assim que disponível. Até lá, fixar a versão exata no `package.json` (sem o `^`) para evitar atualizações automáticas.

```json
"next-auth": "5.0.0-beta.31"  // sem ^
```

### 5.4 Inconsistência entre `engines` e gestor de pacotes

**Problema:** O `package.json` declara `"yarn": ">=4.0.0"` em `engines`, mas os scripts e README usam `npm`.

**Solução:** Escolher um gestor de pacotes e ser consistente. Se usar npm:

```json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=10.0.0"
}
```

### 5.5 Volume excessivo de scripts npm

**Problema:** O `package.json` contém mais de 100 scripts npm. Isto torna a manutenção difícil e a descoberta quase impossível para novos colaboradores.

**Solução:**
- Agrupar os scripts operacionais de dados num `Makefile` ou ficheiro de tarefas separado
- Documentar os scripts mais usados no README com descrição
- Considerar usar `turbo.json` para orquestrar tarefas em vez de encadear npm scripts

---

## 6. Sugestões de Melhoria

### 6.1 Estratégia de branching e proteção do main

**Situação atual:** 92 commits todos diretamente em `main`, sem branches de feature visíveis nem Pull Requests.

**Recomendação:**
- Proteger o branch `main` no GitHub (Settings → Branches → Branch protection rules)
- Requerer: revisão de pelo menos 1 pessoa + status checks (CI) antes de merge
- Trabalhar em branches `feature/`, `fix/`, `chore/` e fazer merge via PR

### 6.2 CI/CD pipeline robusto

**Verificar e complementar** o que já existe em `.github/workflows/` com:

```yaml
# Em cada PR:
- lint (eslint --max-warnings 0)
- type-check (tsc --noEmit)
- test (vitest run)
- build (next build)

# Em merge para main:
- deploy automático para staging
- testes E2E em staging (playwright)
- deploy para produção após aprovação manual
```

### 6.3 Versionamento semântico com Releases

**Situação atual:** `version: "0.1.0"` no package.json, sem Releases no GitHub.

**Recomendação:** Adotar [Conventional Commits](https://www.conventionalcommits.org/) e criar Releases no GitHub para marcar milestones. Ferramentas como `semantic-release` ou `changesets` automatizam isto.

### 6.4 Isolamento do ML Service

**Situação atual:** O `ml-service` Python coexiste no monorepo JavaScript.

**Consideração:** À medida que o ML service cresce, a mistura de tooling Python/Node num mesmo repositório aumenta a complexidade de CI e onboarding.

**Opções:**
- Manter no monorepo mas com documentação clara das dependências Python (`requirements.txt` próprio, virtualenv documentado)
- Extrair para repositório separado com CI independente (recomendado a médio prazo)

### 6.5 Cobertura de testes

O README menciona o objetivo de >80% de cobertura. Verificar o estado atual:

```bash
npm run test:changed:coverage
```

E adicionar ao CI um threshold mínimo para evitar regressão.

### 6.6 Documentação de API interna

Com uma base de código desta escala, considerar:
- **Swagger/OpenAPI** para as API routes do Next.js
- **TSDoc** nos packages partilhados (`@akmleva/shared`, `@akmleva/ui`, `@akmleva/auth`)

### 6.7 Docker Compose para desenvolvimento local

O `docker-compose.yml` existe — verificar se cobre o setup completo para um novo colaborador (base de dados, Redis, serviços externos mockados). Um `docker-compose.dev.yml` separado para desenvolvimento local facilita o onboarding.

---

## 7. Scorecard

| Área                          | Avaliação | Notas                                         |
|-------------------------------|-----------|-----------------------------------------------|
| Stack técnico                 | ⭐⭐⭐⭐⭐   | Escolhas modernas e coerentes                 |
| **Segurança**                 | 🚨 Crítico | Ficheiros `.env.prod*` expostos publicamente  |
| Infraestrutura de testes      | ⭐⭐⭐⭐    | Vitest + Playwright + MSW + Storybook         |
| Observabilidade               | ⭐⭐⭐⭐    | Sentry em 3 runtimes                          |
| Pipeline de dados             | ⭐⭐⭐⭐⭐   | Sofisticado e bem estruturado                 |
| Organização do repositório    | ⭐⭐⭐      | Raiz poluída com dados e artefactos           |
| Processo de desenvolvimento   | ⭐⭐       | Sem branching strategy nem PRs visíveis       |
| Documentação                  | ⭐⭐⭐⭐    | README detalhado e bem estruturado            |
| Dependências                  | ⭐⭐⭐      | next-auth em beta é risco para produção       |

---

## 8. Plano de Ação Prioritário

### 🔴 Imediato (hoje)

1. Revogar o token OIDC Vercel exposto no dashboard Vercel
2. Remover `.env.prod` e `.env.prod2` do repositório com `git rm --cached`
3. Limpar o histórico com BFG Repo-Cleaner
4. Atualizar o `.gitignore` para cobrir todos os ficheiros `.env.*`

### 🟡 Curto prazo (próximas 2 semanas)

5. Mover CSVs e JSONs de dados da raiz para `/data/` ou ignorar pelo git
6. Mover summaries e relatórios Lighthouse para `/docs/`
7. Fixar `next-auth` sem o operador `^`
8. Corrigir inconsistência `engines` (yarn vs npm)
9. Ativar proteção do branch `main` no GitHub

### 🟢 Médio prazo (próximo mês)

10. Implementar CI/CD completo com lint + type-check + tests em cada PR
11. Adotar Conventional Commits e criar primeiro Release
12. Reduzir e documentar os scripts npm mais usados
13. Verificar e documentar o setup Docker para desenvolvimento local
14. Avaliar extração do ML service para repositório separado

---

*Auditoria realizada com base na análise do repositório público, estrutura de ficheiros, `package.json`, `.env.prod`, e documentação README. Para uma auditoria mais profunda do código fonte (lógica de negócio, segurança de API routes, qualidade de testes), seria necessário acesso ao código fonte completo.*
