# Neon Database Branching + Vercel

Este guia explica como configurar **Neon Database Branching** com **Vercel** para aplicar migrações Prisma automaticamente.

---

## 📋 Arquitectura

```
Git Push (main)
      │
      ▼
┌─────────────────────┐     ┌──────────────────────────┐
│  GitHub Actions      │     │  Vercel Build             │
│  (deploy-migrations) │ ──► │  (prisma generate         │
│  npx prisma migrate  │     │   + next build)           │
│  deploy              │     │                           │
└─────────────────────┘     └──────────────────────────┘
      │                              │
      ▼                              ▼
┌─────────────────────┐     ┌──────────────────────────┐
│  Neon Production    │     │  Vercel Runtime           │
│  Database (main)    │     │  (conexão via DATABASE_URL)│
└─────────────────────┘     └──────────────────────────┘
```

---

## 🚀 Setup Passo a Passo

### 1. Criar Migration Inicial

Já executaste `npx prisma migrate dev --name init`. O ficheiro de migração foi criado em `prisma/migrations/`.

### 2. Configurar GitHub Secrets

No teu repositório GitHub, adiciona os seguintes **Repository secrets**:

| Secret | Valor | Onde obter |
|--------|-------|------------|
| `DATABASE_URL` | pooled connection string | Neon Dashboard → Connection Details → Connection pooling |
| `DATABASE_URL_UNPOOLED` | direct connection string | Neon Dashboard → Connection Details → Direct connection |
| `VERCEL_TOKEN` | Vercel Access Token | Vercel Dashboard → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Vercel Org ID | Vercel Dashboard → Settings → General → ID |
| `VERCEL_PROJECT_ID` | Vercel Project ID | Vercel Dashboard → Project → Settings → Project ID |

### 3. Configurar Neon Branching (Preview Environments)

Para ter uma database separada para cada Preview Deployment no Vercel:

**Opção A — Automático (Neon Vercel Integration)**

1. Vai ao [Neon Console](https://console.neon.tech) → Integrations → Vercel
2. Clica **Connect to Vercel**
3. Seleciona o teu projeto e permite que o Neon crie branches automaticamente para cada Preview
4. O Neon injeta automaticamente a env var `DATABASE_URL` correta (branch da Preview) nos Preview Deployments do Vercel

**Opção B — Manual (GitHub Actions)**

O workflow `.github/workflows/deploy-migrations.yml` já faz isto:
1. No push para `main`, corre `prisma migrate deploy` primeiro
2. Depois faz deploy para Vercel

Para previews, podes extender o workflow:

```yaml
jobs:
  create-branch:
    if: github.event_name == 'pull_request'
    steps:
      - name: Create Neon branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          branch_name: preview/pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

### 4. Vercel Release Command (Alternativa)

Se preferires não usar GitHub Actions, podes configurar um Release Command no Vercel:

**Passos no Vercel Dashboard:**

1. Vai a **Project Settings → Git → Deploy Hooks**
2. Cria um **Deploy Hook** (ex: `migrate-production`)
3. Copia a URL do hook
4. Cria um script ou cron job que chama este hook

Ou adiciona ao `vercel.json`:

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm ci"
}
```

E depois usa um **cron job externo** (ou Vercel Cron Jobs) para correr:

```bash
curl -X POST https://api.vercel.com/v1/deployments?teamId=<team> \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"migration","project":"<project>","target":"production"}'
```

### 5. Vercel Cron Jobs (Gratuito no Pro plan)

No `vercel.json` já tens um cron configurado:

```json
{
  "crons": [
    {
      "path": "/api/cron/prisma-migrate",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Precisas criar o endpoint `src/app/api/cron/prisma-migrate/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const output = execSync('npx prisma migrate deploy', {
      cwd: process.cwd(),
      env: { ...process.env },
    }).toString();
    return NextResponse.json({ ok: true, output });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
```

Depois adiciona `CRON_SECRET` às env vars do Vercel.

---

## 🔄 Fluxo de Trabalho Completo

### Desenvolvimento Local
```bash
npx prisma migrate dev --name <descricao_da_mudanca>
```

### Produção (automático via GitHub Actions)
```
Push para main → GitHub Actions corre prisma migrate deploy → Vercel deploy
```

### Preview (com Neon Branching)
```
PR aberta → GitHub Actions cria Neon branch + Vercel Preview com DATABASE_URL da branch
```

---

## ⚠️ Troubleshooting

### `P1001: Can't reach database server`
O Vercel Build não consegue acessar o Neon durante o build. ✅ **Já resolvido**: removemos `prisma migrate deploy` do build — agora as migrações correm via GitHub Actions.

### `P3005: The database schema is not empty`
A base de dados já tem dados mas sem histórico de migrações. Solução:
```bash
npx prisma migrate resolve --applied 20260616161214_init
```

### `Environment variable DATABASE_URL not set`
Verifica se as env vars estão configuradas:
- Vercel Dashboard → Project → Settings → Environment Variables
- GitHub → Settings → Secrets and variables → Actions

---

## 📚 Referências

- [Neon + Vercel Integration Guide](https://neon.tech/docs/guides/vercel)
- [Neon Branching API](https://neon.tech/docs/manage/branching)
- [Prisma Deploy to Vercel](https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel)
- [Vercel Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
