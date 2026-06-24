# Auditoria Técnica AKMLEVA – beta-app
**Arquiteto de Software Sénior / Tech Lead**  
**Data:** 2026-06-24  
**Repositório:** https://github.com/luismccampos-beep/beta-app  
**Stack:** Next.js 15 + TypeScript + Prisma + PostgreSQL/Neon + Tailwind v4 + shadcn/ui

---

## Índice

1. [Design e Arquitetura](#1-design-e-arquitetura)
2. [Base de Dados](#2-base-de-dados)
3. [Serviços e APIs](#3-serviços-e-apis)
4. [UI / UX Design](#4-ui--ux-design)
5. [Roadmap Priorizado](#5-roadmap-priorizado)

---

## 1. Design e Arquitetura

### 1.1 Melhorias Críticas

#### [CRIT-ARCH-1] Sem camada de serviço – API routes falam direto com Prisma

**Local:** `src/app/api/travel/v1/destinations/route.ts`, `hotels/route.ts`, etc.

**Problema:** Lógica de negócio, mapeamento DB → DTO e fallback para bundle estão todos no handler. Duplicação de queries, impossível testar isoladamente, qualquer mudança no schema quebra 15 endpoints. Violação de SRP.

**Correção:**

Criar estrutura em camadas:
```
src/lib/travel/
  catalog-db.ts              # atual – passa a repository
  services/
    destination.service.ts
    hotel.service.ts
  repositories/
    destination.repository.ts   # só Prisma
  dto/
    destination.dto.ts
  schemas/
    destination.schema.ts       # Zod
```

Exemplo:
```ts
// src/lib/travel/services/destination.service.ts
import { SearchSchema } from '../schemas/destination.schema';
import * as destinationRepo from '../repositories/destination.repository';
import { toDestinationDTO } from '../dto/destination.dto';

export async function searchDestinations(input: unknown) {
  const validated = SearchSchema.parse(input);
  const { items, total } = await destinationRepo.search(validated);
  return { total, items: items.map(toDestinationDTO) };
}

// src/app/api/travel/v1/destinations/route.ts
import { searchDestinations } from '@/lib/travel/services/destination.service';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const result = await searchDestinations(Object.fromEntries(url.searchParams));
  return NextResponse.json({ ok: true, ...result });
}
```

**Tarefas:**
- [ ] Criar `src/lib/travel/services/` e `src/lib/travel/repositories/`
- [ ] Extrair `searchDestinationsDb` → `destination.repository.ts`
- [ ] Criar `destination.dto.ts` com `toDestinationDTO()`
- [ ] Criar `destination.schema.ts` com Zod para validação de input
- [ ] Refatorar `/api/travel/v1/destinations/route.ts` para usar service (template)
- [ ] Replicar padrão para `hotels`, `flights`, `listings` – 1 endpoint de cada vez
- [ ] Adicionar testes unitários para `destination.service.ts` com Vitest

---

#### [CRIT-ARCH-2] Monorepo quebrado

**Local:** `package.json` (root)

**Problema:** Tens `packages/auth`, `packages/shared`, `packages/ui` declarados em `workspaces`, mas a app em `src/` não consome os packages. Código duplicado em `src/auth.ts` vs `packages/auth/src/`.

Isto é o pior dos dois mundos: pagas o custo de monorepo sem o benefício.

**Correção – escolher 1 estratégia:**

**Opção A – App Router puro (recomendado para projeto solo):**
- [ ] Mover código útil de `packages/*` para `src/lib/`
- [ ] Apagar pasta `/packages`
- [ ] Remover `"workspaces": ["packages/*"]` do `package.json`

**Opção B – Monorepo real:**
- [ ] Mover app para `apps/web/`
- [ ] `apps/web` consome `@akmleva/auth`, `@akmleva/ui`, `@akmleva/shared`
- [ ] Configurar Turborepo corretamente com `turbo.json` na root
- [ ] Eliminar duplicações `src/auth.ts` ✕ `packages/auth/src/`

---

#### [CRIT-ARCH-3] Auth híbrida – NextAuth + custom JWT

**Local:** `src/auth.ts`, `packages/auth/src/utils/tokenManager.ts`, `src/app/api/auth/login/route.ts`

**Problema:** NextAuth v5 com PrismaAdapter, mas também tens `Session`, `ApiKey`, `TwoFactorDevice`, JWT próprio, e rota custom `/api/auth/login`. Vai dar race conditions de sessão.

**Correção:**
- [ ] Escolher **1** sistema: NextAuth v5 **OU** custom JWT – não ambos
- [ ] Se ficar com NextAuth (recomendado):
  - [ ] Remover `src/app/api/auth/login/route.ts` custom – usar `signIn()` do NextAuth
  - [ ] Remover `packages/auth/src/utils/tokenManager.ts` ou integrar via NextAuth callbacks
  - [ ] Consolidar `Session` model – usar o do NextAuth Adapter
  - [ ] Manter `TwoFactorDevice` como extensão, ligar via NextAuth callbacks
- [ ] Se ficar com custom JWT:
  - [ ] Remover NextAuth completamente
  - [ ] Documentar fluxo de refresh token rotation (já está bem desenhado no schema `Session`)
- [ ] Testar login/logout em 2 tabs simultâneas – verificar race conditions

---

### 1.2 Bons detalhes a adicionar

#### [ARCH-4] Validação de input com Zod em todas as API routes

Hoje `GET /api/travel/v1/destinations?q=...` faz `parseInt` sem validação. Um `limit=9999999` faz full table scan.

```ts
// src/lib/travel/schemas/destination.schema.ts
import { z } from 'zod';

export const SearchSchema = z.object({
  q: z.string().max(100).optional(),
  pais: z.string().max(80).optional(),
  continente: z.string().max(80).optional(),
  lang: z.string().length(2).default('pt'),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
});
export type SearchDestinationsInput = z.infer<typeof SearchSchema>;
```

**Tarefas:**
- [ ] Instalar/configurar Zod (já está no package.json)
- [ ] Criar schemas para `destinations`, `hotels`, `flights`, `listings`
- [ ] Aplicar em todas as API routes – middleware `withValidation(schema, handler)`

---

#### [ARCH-5] Prisma client stub – adicionar logging em dev

**Local:** `src/lib/prisma.ts`

O stub que retorna `[]` no build evita P1001 na Vercel – bom. Mas mascara queries que deviam ser `dynamic = 'force-dynamic'`.

```ts
const throwOnMutation = (prop: string | symbol) => () => { ... }

// adicionar:
if (process.env.NODE_ENV === 'development') {
  console.warn(`[prisma stub] ${String(prop)}() accessed during build – check dynamic export`);
}
```

**Tarefas:**
- [ ] Adicionar log no `createStub()` quando acedido em dev
- [ ] Auditar páginas que disparam o stub – adicionar `export const dynamic = 'force-dynamic'`
- [ ] Documentar no README quando usar o stub

---

#### [ARCH-6] Landing page é client component desnecessariamente

**Local:** `src/app/page.tsx`

Hidrata React inteiro só para fazer `router.push`.

```ts
// Antes: 'use client' + useRouter + useSession
// Depois: Server Component
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();
  redirect(session ? '/preferences/edit' : '/auth');
}
// ou passar onGetStarted como Server Action
```

**Tarefas:**
- [ ] Converter `src/app/page.tsx` em Server Component
- [ ] Mover `onGetStarted` para Server Action / middleware redirect
- [ ] Medir redução de JS bundle (target: -15 KB)

---

## 2. Base de Dados

**Schema:** `prisma/schema.prisma` – 4609 linhas, 110+ models

### 2.1 Melhorias Críticas

#### [CRIT-DB-1] Nomenclatura inconsistente

Comentário na linha 1-4 do schema: `some models use @map("created_at") and others @map("createdat")`.

Encontrado:
- `User` → `@@map("users")`, campos `@map("created_at")`
- `Package` → `@@map("packages")`, campos `@map("createdat")`
- `Hotel` → `createdAt @map("createdat")`

Parte queries raw, tooling, e onboarding.

**Correção:**
Escolher `snake_case` e migrar tudo.

**Tarefas:**
- [ ] Fazer inventário completo: `grep -n '@map' prisma/schema.prisma | sort`
- [ ] Escolher convenção: **snake_case** (`created_at`) – é a do Postgres
- [ ] Criar migração de consolidação – 1 tabela de cada vez, começando pelas menos usadas
- [ ] Prioridade: `Package`, `Hotel`, `Flight`, `Booking` (mais usadas na API)
- [ ] Atualizar todos os `@map()` em `schema.prisma`
- [ ] Rodar `prisma migrate dev` num branch separado, testar em staging
- [ ] Atualizar queries raw em `/scripts/*` que referenciam colunas antigas
- [ ] Documentar convenção em `CONTRIBUTING.md`: *"Novos models: sempre snake_case"*

---

#### [CRIT-DB-2] Modelos duplicados – risco de dados divergentes

| Duplicação | Tabelas | Ação |
|---|---|---|
| Pagamentos | `Payment` + `PaymentTransaction` | Idênticos. Migra dados de `Payment` → `PaymentTransaction`, depois drop |
| Hotéis | `Hotel` + `Accommodation` + `HotelProperty` + `WvHotel` | Manter `Hotel` (core) + `WvHotel` (catálogo import). Remover `Accommodation` e `HotelProperty` se órfãos |
| Atividades | `Activity` + `Service` + `ActivityOffering` | Consolidar em `Service` |
| CRM | `CrmCustomer` / `CrmBooking` vs `User` / `Booking` + `Agency`/`Client` | Escolher 1: SaaS multi-tenant (`Agency → Client`) **OU** B2C (`User → Booking`). Não ambos |

**Tarefas:**
- [ ] **Pagamentos:** criar script de migração `Payment → PaymentTransaction`
  - [ ] Verificar FK constraints
  - [ ] Dry-run em staging
  - [ ] Migrar + dropar `payments` table
  - [ ] Atualizar código que referencia `prisma.payment`
- [ ] **Hotéis:** auditar uso de `Accommodation` e `HotelProperty`
  - [ ] `grep -r "accommodation\|HotelProperty" src/ --include="*.ts"`
  - [ ] Se sem uso → criar migração para dropar
  - [ ] Documentar: `Hotel` = inventário próprio, `WvHotel` = catálogo Wikivoyage
- [ ] **Atividades/Services:** mapear campos `Activity` → `Service`
  - [ ] Migração de dados
  - [ ] Dropar `activities`, `activity_offerings`
- [ ] **CRM duplicado:** decisão de produto
  - [ ] Opção A: B2C only → dropar `CrmCustomer`, `CrmBooking`, `CrmProduct`, `Agency`, `Client`, `Lead`
  - [ ] Opção B: SaaS multi-tenant → dropar `User.bookings` B2C, manter `Agency → Client → Booking`
  - [ ] Documentar decisão em `docs/ARCHITECTURE.md`

---

#### [CRIT-DB-3] Índices em falta para queries hot

`searchDestinationsDb` faz:
```sql
WHERE nome ILIKE '%lisboa%'
```
Full seq scan, sem índice. Com 10k destinos já dói.

**Correção – PostgreSQL trigram + índices compostos:**

```sql
-- 1. Busca de destinos por nome
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX wv_destinations_nome_trgm 
  ON wv_destinations USING gin (nome gin_trgm_ops);
CREATE INDEX wv_destinations_pais_lang 
  ON wv_destinations(pais, lang);
CREATE INDEX wv_destinations_slug_lang 
  ON wv_destinations(slug, lang);

-- 2. Hotels nearby (getHotelsNearbyFromDb)
CREATE INDEX wv_hotels_geo 
  ON wv_hotels(latitude, longitude) 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX wv_hotels_destino_preco 
  ON wv_hotels(destino_id, preco_por_noite);

-- 3. Bookings – query mais comum
-- Adicionar ao schema.prisma:
model Booking {
  @@index([userId, bookingStatus, startDate])
  @@index([agencyId, bookingStatus])
  @@index([destinationId, startDate])
}

-- 4. Flights
CREATE INDEX wv_flights_origem_destino 
  ON wv_flights(origem, destino_id);
CREATE INDEX wv_flights_preco ON wv_flights(preco);

-- 5. Reviews
CREATE INDEX reviews_destination_rating 
  ON reviews(destination_id, rating DESC) 
  WHERE review_status = 'APPROVED';
```

**Tarefas:**
- [ ] Adicionar `pg_trgm` extension na migração inicial
- [ ] Criar índices GIN para `wv_destinations.nome`
- [ ] Criar índice geo para `wv_hotels`
- [ ] Adicionar índices compostos em `Booking` no `schema.prisma` → `prisma migrate`
- [ ] Rodar `EXPLAIN ANALYZE` em `searchDestinationsDb` antes/depois – documentar ganho
- [ ] Configurar `pg_stat_statements` no Neon para monitorar slow queries
- [ ] Avaliar Meilisearch / Typesense para full-text a sério (>50k destinos)

---

### 2.2 Bons detalhes a adicionar

#### [DB-4] GIS real com PostGIS

Hoje: `latitude/longitude Decimal`, bounding box em JS + `haversineKm`.

Com PostGIS:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE wv_hotels ADD COLUMN geom geography(POINT, 4326);
UPDATE wv_hotels SET geom = ST_MakePoint(longitude, latitude)::geography 
  WHERE latitude IS NOT NULL;

CREATE INDEX wv_hotels_geom_idx ON wv_hotels USING gist(geom);

-- Query nearby:
SELECT * FROM wv_hotels 
WHERE ST_DWithin(geom, ST_MakePoint(lon,lat)::geography, 10000)
ORDER BY geom <-> ST_MakePoint(lon,lat)::geography
LIMIT 50;
```
50x mais rápido, usa índice GiST.

**Tarefas:**
- [ ] Ativar PostGIS no Neon
- [ ] Adicionar coluna `geom` em `wv_hotels` e `wv_destinations`
- [ ] Criar trigger para auto-popular `geom` a partir de lat/lon
- [ ] Reescrever `getHotelsNearbyFromDb` com `ST_DWithin`
- [ ] Benchmark antes/depois

---

#### [DB-5] Soft delete inconsistente

`User.deletedAt`, `Trip.deletedAt`, `Article.deletedAt`, mas `Booking` não tem.

**Tarefas:**
- [ ] Definir política global: soft delete **ou** hard delete – documentar
- [ ] Se soft delete:
  - [ ] Adicionar `deletedAt` em `Booking`, `Payment`, `Review`
  - [ ] Criar Prisma middleware para filtrar `deletedAt IS NULL` automaticamente:
    ```ts
    prisma.$use(async (params, next) => {
      if (params.action === 'findMany' && params.model) {
        params.args.where = { deletedAt: null, ...params.args.where };
      }
      return next(params);
    });
    ```
- [ ] Se hard delete: remover `deletedAt` dos models existentes, usar audit log

---

#### [DB-6] N+1 em `searchDestinationsDb`

Faz 1 query para destinos + 2 `groupBy` para hotel stats. OK para 24 rows, mas dói a 100.

**Tarefas:**
- [ ] Criar view materializada:
  ```sql
  CREATE MATERIALIZED VIEW destination_hotel_stats AS
  SELECT 
    destino_id,
    AVG(estrelas) as avg_stars,
    jsonb_object_agg(tipo_alojamento, count) as hotel_types
  FROM wv_hotels
  WHERE fonte != 'rejected_geo'
  GROUP BY destino_id;
  CREATE UNIQUE INDEX ON destination_hotel_stats(destino_id);
  ```
- [ ] Refresh automático via cron: `REFRESH MATERIALIZED VIEW CONCURRENTLY destination_hotel_stats`
- [ ] Mapear view no Prisma
- [ ] Comparar latência antes/depois

---

#### [DB-7] Enums de pagamento inconsistentes

`PaymentStatus` tem: `PAID`, `SUCCEEDED`, `COMPLETED`, `CANCELED` / `CANCELLED`.

**Tarefas:**
- [ ] Padronizar para Stripe: `requires_payment`, `processing`, `succeeded`, `canceled`
- [ ] Ou padronizar para interno simples: `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `CANCELLED`
- [ ] Criar migração de dados para mapear valores antigos
- [ ] Atualizar todo o código que checa `payment.status`
- [ ] Adicionar check constraint na DB

---

## 3. Serviços e APIs

### 3.1 Melhorias Críticas

#### [CRIT-API-1] Sem rate limiting, sem validação, sem auth

`/api/travel/v1/hotels/nearby?lat=...&lng=...` – sem rate limit, sem API key. Um scraper esgota a DB.

Já tens `@upstash/ratelimit` no `package.json` – não está a ser usado.

**Correção:**

```ts
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const travelRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "akmleva:travel",
});

export async function checkRateLimit(req: Request, identifier?: string) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success, limit, remaining, reset } = await travelRatelimit.limit(identifier ?? ip);
  return { success, limit, remaining, reset };
}

// src/app/api/travel/v1/destinations/route.ts
export async function GET(req: Request) {
  const rateLimit = await checkRateLimit(req);
  if (!rateLimit.success) {
    return NextResponse.json(
      { ok: false, error: "Rate limited" },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }
  // ...
}
```

**Tarefas:**
- [ ] Configurar Upstash Redis – adicionar `UPSTASH_REDIS_REST_URL` / `TOKEN` ao `.env`
- [ ] Criar `src/lib/rate-limit.ts` com 3 tiers:
  - `publicRatelimit`: 30 req/min (endpoints públicos travel)
  - `authRatelimit`: 120 req/min (utilizadores autenticados)
  - `apiKeyRatelimit`: 1000 req/min (API keys)
- [ ] Aplicar rate limit em TODAS as routes `/api/travel/*`
- [ ] Adicionar headers `X-RateLimit-*` nas respostas
- [ ] Testar com `ab -n 100 -c 10 http://localhost:3000/api/travel/v1/destinations`

---

#### [CRIT-API-2] Tratamento de erros inconsistente

Algumas routes retornam `{ok: false, message}`, outras lançam. Não há error boundary centralizado.

**Correção:**

```ts
// src/lib/api/handler.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

type Handler = (req: Request, ctx?: any) => Promise<Response>;

export function apiHandler(fn: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      console.error('[API Error]', e);
      
      if (e instanceof ZodError) {
        return NextResponse.json(
          { ok: false, error: 'Validation failed', issues: e.issues },
          { status: 400 }
        );
      }
      
      // Sentry
      // Sentry.captureException(e);
      
      return NextResponse.json(
        { ok: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Uso:
export const GET = apiHandler(async (req) => {
  const data = await searchDestinations(...);
  return NextResponse.json({ ok: true, data });
});
```

**Tarefas:**
- [ ] Criar `src/lib/api/handler.ts` com wrapper
- [ ] Integrar ZodError handling
- [ ] Integrar Sentry capture
- [ ] Aplicar em todas as API routes travel
- [ ] Padronizar formato de erro: `{ ok: false, error: string, code?: string }`

---

#### [CRIT-API-3] API versioning quebrado

Tens `/api/travel/destinations` **E** `/api/travel/v1/destinations` – formatos diferentes.

**Tarefas:**
- [ ] Auditar: `find src/app/api -name "route.ts" | sort`
- [ ] Listar endpoints duplicados sem `/v1`
- [ ] Adicionar redirect 301 das rotas antigas → `/v1/`:
  ```ts
  // src/app/api/travel/destinations/route.ts
  export async function GET(req: Request) {
    const url = new URL(req.url);
    url.pathname = url.pathname.replace('/api/travel/', '/api/travel/v1/');
    return NextResponse.redirect(url, 301);
  }
  ```
- [ ] Marcar rotas antigas como deprecated no README
- [ ] Após 30 dias, remover rotas sem `/v1`
- [ ] Documentar versionamento em `docs/TRAVEL_CATALOG_API.md`

---

### 3.2 Bons detalhes a adicionar

#### [API-4] Cache nas APIs de catálogo

Tens `EmbeddingCache` e `LlmCache` no schema – ótimo. Mas `/destinations`, `/hotels` não têm cache. São dados quase estáticos.

**Tarefas:**
- [ ] Adicionar `export const revalidate = 3600` nas routes de catálogo read-only
- [ ] Ou usar Redis cache:
  ```ts
  const cacheKey = `dest:${slug}`;
  const cached = await redis.get(cacheKey);
  if (cached) return NextResponse.json(cached);
  // ... fetch
  await redis.set(cacheKey, result, { ex: 3600 });
  ```
- [ ] Cache headers: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
- [ ] Invalidar cache quando `wv_destination.updated_at` muda

---

#### [API-5] OpenAPI / Swagger

Com 40+ endpoints de travel, gera schema OpenAPI a partir do Zod.

**Tarefas:**
- [ ] Instalar `@asteasolutions/zod-to-openapi`
- [ ] Gerar `openapi.json` a partir dos Zod schemas
- [ ] Servir Swagger UI em `/api/docs`
- [ ] Facilita integrar o `ml-service` Python

---

#### [API-6] API Keys – ligar o que já existe

Tens um model `ApiKey` muito bem desenhado (scopes, IP whitelist, rate limit), mas não vejo middleware a usá-lo.

**Tarefas:**
- [ ] Criar `src/lib/api/auth-api-key.ts`:
  ```ts
  export async function validateApiKey(req: Request) {
    const key = req.headers.get('x-api-key');
    if (!key) return null;
    const hash = await bcrypt.compare(key, stored.keyHash);
    // check scopes, IP whitelist, expiry, rate limit
    return apiKey;
  }
  ```
- [ ] Middleware que valida API key em `/api/travel/v1/*`
- [ ] Permitir auth via: `Authorization: Bearer <key>` OU `x-api-key: <key>`
- [ ] Dashboard para gerir API keys (já tens model, falta UI)
- [ ] Documentar em `docs/TRAVEL_CATALOG_API.md`

---

#### [API-7] Observabilidade

Tens `@sentry/nextjs` instalado – bom.

**Tarefas:**
- [ ] Adicionar Sentry tracing em `searchDestinationsDb` / `getHotelsNearbyFromDb`
- [ ] Adicionar `console.time` / OpenTelemetry spans nas queries Prisma lentas
- [ ] Configurar Sentry Performance – sample rate 10% em prod
- [ ] Alertas: p95 > 800ms em `/api/travel/v1/destinations`
- [ ] Dashboard: requests/min, error rate, p95 latency por endpoint

---

#### [API-8] ml-service – completar integração

FastAPI em `/ml-service`, separado do Next.js – bom.

**Tarefas:**
- [ ] Criar `docker-compose.yml` na root que sobe: `web` + `ml-service` + `postgres` + `redis`
- [ ] Documentar fluxo: `travel:ml:export` → `travel:ml:train` → servir embeddings
- [ ] API route `/api/travel/v1/recommend` deve chamar `ml-service` via API key interna
- [ ] Health check entre web ↔ ml-service
- [ ] CI: build e test do ml-service no mesmo pipeline

---

## 4. UI / UX Design

**Stack UI:** Tailwind CSS v4 + shadcn/ui + Radix UI + Framer Motion + lucide-react  
**Páginas analisadas:** `LandingPage.tsx`, `DestinationDetailPage.tsx` (1273 linhas), `AppHeader.tsx`  
**i18n:** next-intl – 4 línguas (pt/en/es/fr)

### 4.1 Melhorias Críticas

#### [CRIT-UI-1] Identidade visual inconsistente – 2 sistemas de cor a lutar

**Local:** `src/styles/theme.css` vs todos os componentes

O `theme.css` define `--primary: #030213` (quase preto, shadcn default), mas a UI usa hardcoded `from-teal-600 to-orange-500`, `text-teal-700`, `bg-teal-50` em todo o lado.

Resultado: `<Button variant="default">` dá botão preto, mas na landing usas `className="bg-gradient-to-r from-teal-600 to-orange-500"`. Duas marcas visuais no mesmo site.

**Correção:**

```css
/* src/styles/theme.css */
:root {
  /* AKMLEVA Brand */
  --primary: oklch(0.55 0.12 185);           /* teal-600 */
  --primary-foreground: oklch(1 0 0);
  --accent: oklch(0.68 0.17 45);             /* orange-500 */
  --accent-foreground: oklch(1 0 0);
  
  --secondary: oklch(0.95 0.015 185);        /* teal-50 */
  --secondary-foreground: oklch(0.35 0.08 185);
  
  --ring: oklch(0.55 0.12 185);              /* teal ring */
  /* ... resto */
}

.dark {
  --primary: oklch(0.65 0.12 185);
  --primary-foreground: oklch(0.1 0.02 185);
  --accent: oklch(0.70 0.17 45);
  /* ... */
}
```

```ts
// tailwind.config.ts (criar)
import type { Config } from 'tailwindcss'
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: {
            DEFAULT: 'oklch(0.55 0.12 185)',
            light: 'oklch(0.95 0.015 185)',
            dark: 'oklch(0.35 0.08 185)',
          },
          orange: {
            DEFAULT: 'oklch(0.68 0.17 45)',
            light: 'oklch(0.96 0.03 45)',
          }
        }
      }
    }
  }
} satisfies Config
```

Depois usar sempre `<Button variant="default">` sem override.

**Tarefas:**
- [ ] Criar `tailwind.config.ts` com palete AKMLEVA (teal + orange)
- [ ] Atualizar CSS variables em `theme.css` para usar cores da marca
- [ ] Fazer find/replace: `from-teal-600 to-orange-500` → usar `bg-primary` + variante gradient no `buttonVariants`
- [ ] Adicionar variantes ao `button.tsx`:
  ```ts
  variant: {
    default: "bg-primary ...",
    brand: "bg-gradient-to-r from-teal-600 to-orange-500 ...",
    // ...
  }
  ```
- [ ] Remover todos os `text-teal-700`, `bg-teal-50`, `border-teal-300` hardcoded – usar `text-primary`, `bg-secondary`, etc.
- [ ] Testar dark mode completo após mudança – verificar contraste
- [ ] Gerar screenshot antes/depois de: Landing, Destination Detail, Dashboard

---

#### [CRIT-UI-2] DestinationDetailPage.tsx – 1273 linhas num único Client Component

**Local:** `src/app/components/pages/DestinationDetailPage.tsx`

Toda a página num ficheiro `'use client'`, com fetch, parallax, lightbox, mapa, hotéis… Hidrata ~50KB de JS para todas as visitas. Fetch é feito via `useEffect` client-side → waterfall: HTML vazio → JS → fetch → skeleton. Mata SEO.

**Correção – migrar para Server Components:**

```
src/app/[locale]/destinations/[slug]/
  page.tsx                      # Server Component – fetch Prisma
  loading.tsx                   # Suspense skeleton
  components/
    DestinationHero.tsx         # Server, pode ter client islands
    DestinationGallery.tsx      # 'use client' – lightbox only
    DestinationMap.tsx          # 'use client' – Leaflet only
    DestinationHotels.tsx       # Server
    DestinationTips.tsx         # Server
```

```tsx
// app/[locale]/destinations/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import { DestinationHero } from './components/DestinationHero';
import dynamic from 'next/dynamic';

const DestinationMap = dynamic(() => import('./components/DestinationMap'), { ssr: false });

export default async function DestinationPage({ params }: { params: { slug: string } }) {
  const data = await getDestinationBySlugFromDb(params.slug); // direto Prisma, sem fetch
  if (!data) notFound();
  
  return (
    <>
      <DestinationHero data={data} />
      <Suspense fallback={<MapSkeleton />}>
        <DestinationMap data={data} />
      </Suspense>
      {/* ... */}
    </>
  );
}

export async function generateStaticParams() {
  // ISR: pré-gerar top 100 destinos
  const top = await prisma.wvDestination.findMany({ 
    take: 100, 
    orderBy: { hotelCount: 'desc' },
    select: { slug: true }
  });
  return top.map(d => ({ slug: d.slug }));
}
export const revalidate = 3600;
```

**Tarefas:**
- [ ] Quebrar `DestinationDetailPage.tsx` em componentes menores (< 200 linhas cada)
- [ ] Converter página para Server Component – fetch Prisma direto, sem `useEffect`
- [ ] `DestinationMap` / `DestinationGallery` / `TripGo` → Client Components isolados com `dynamic(..., { ssr: false })`
- [ ] Adicionar `loading.tsx` com skeleton (já existe, reutilizar)
- [ ] Adicionar `generateStaticParams()` + `revalidate = 3600` (ISR)
- [ ] Medir: LCP antes/depois, JS bundle antes/depois, Lighthouse score
- [ ] Target: LCP < 2.5s, JS < 120 KB, Lighthouse > 90

---

#### [CRIT-UI-3] Tailwind sem config – design tokens perdidos

Não existe `tailwind.config.ts`. Estás no Tailwind v4 com apenas `@import "tailwindcss"` – perdeste todo o design token da marca. Cores teal/orange hardcoded em ~40 ficheiros.

**Tarefas:**
- [ ] Criar `tailwind.config.ts` (ver [CRIT-UI-1])
- [ ] Definir spacing scale, border radius, shadows da marca
- [ ] Migrar todas as cores hardcoded para tokens
- [ ] Configurar `@theme` inline no CSS se preferires ficar 100% Tailwind v4 sem config file – mas escolhe 1 abordagem e documenta

---

#### [CRIT-UI-4] Tipografia quebrada

`theme.css` define:
```css
h1 { font-size: var(--text-2xl); }
h2 { font-size: var(--text-xl); }
```
Mas `--text-2xl` etc. não existem (eram do Tailwind v3). H1/H2 globais ficam pequenos. Na landing usas `text-5xl md:text-7xl` inline.

**Tarefas:**
- [ ] Remover bloco `h1, h2, h3, button { font-size: ... }` do `theme.css`
- [ ] Deixar Tailwind gerir tipografia via classes utilitárias
- [ ] OU definir corretamente com `@theme`:
  ```css
  @theme {
    --text-display: 4.5rem;
    --text-display--line-height: 1.1;
  }
  ```
- [ ] Criar componentes tipográficos reutilizáveis: `<H1>`, `<H2>`, `<Lead>` em `src/components/ui/typography.tsx`

---

#### [CRIT-UI-5] Imagens sem otimização – LCP killer

Usas `<img src={data.imageUrl}>` cru em todo o lado. Perdes responsive srcset, lazy loading automático, blur placeholder. Para um site de viagens com muitas fotos, isto é crítico.

**Correção:**
```tsx
import Image from 'next/image';

<Image
  src={data.imageUrl}
  alt={data.nome}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover"
  priority  // hero image only
  placeholder="blur"
  blurDataURL={data.blurDataUrl}
/>
```

**Tarefas:**
- [ ] Trocar `<img>` → `<Image>` em:
  - [ ] `DestinationDetailPage` – hero image (`priority={true}`)
  - [ ] `DestinationGallery`
  - [ ] Cards de destino na listagem
  - [ ] Hotel cards
- [ ] Configurar `next.config.js` → `images.remotePatterns` para Unsplash / Wikivoyage / CDN
- [ ] Gerar blur placeholders no build: usar `plaiceholder` ou guardar `blurDataUrl` na DB
- [ ] Medir LCP antes/depois no Lighthouse – target < 2.5s
- [ ] Adicionar `loading="lazy"` nas imagens below-the-fold (automático com next/image)

---

### 4.2 Bons detalhes a adicionar

#### [UI-6] Design system – completar shadcn

Já tens `buttonVariants` com cva – ótimo.

**Tarefas:**
- [ ] Estender cva para `Card`, `Badge`
- [ ] Badges de tags hoje usam `bg-teal-100/90 text-teal-900` hardcoded → usar `variant="secondary"`
- [ ] Criar variantes consistentes: `default`, `secondary`, `outline`, `brand`
- [ ] Storybook ou Ladle para documentar componentes – `npx storybook@latest init`
- [ ] Criar `src/components/ui/typography.tsx` com `<H1>`, `<H2>`, `<Lead>`, `<Muted>`

---

#### [UI-7] Acessibilidade – audit WCAG

Base boa (aria-label, focus rings), mas falta audit completo.

**Tarefas:**
- [ ] Rodar `axe-core` / Lighthouse Accessibility audit
  ```bash
  npx @axe-core/cli http://localhost:3000
  ```
- [ ] Corrigir contraste: `text-teal-300` no dark mode não passa AA
- [ ] Testar navegação só com teclado – tab order na Destination page
- [ ] Adicionar `skip to content` link
- [ ] Verificar `alt` text em todas as imagens (Unsplash attribution já está – bom!)
- [ ] Testar com screen reader (NVDA / VoiceOver)
- [ ] Target: WCAG 2.1 AA

---

#### [UI-8] Mobile / touch

**Tarefas:**
- [ ] `AppHeader`: 5 elementos à direita colapsam < 375px
  - [ ] Criar menu hamburger / Sheet do shadcn abaixo de `md`
  - [ ] Agrupar: avatar + logout + preferences num dropdown
- [ ] Galeria lightbox: adicionar swipe touch (hoje só ← → teclado)
  ```ts
  // usar framer-motion drag
  <motion.img drag="x" onDragEnd={(_, info) => {
    if (info.offset.x < -50) next();
    if (info.offset.x > 50) prev();
  }}/>
  ```
- [ ] Parallax hero: desativa em mobile / `prefers-reduced-motion`
  ```ts
  const prefersReducedMotion = useReducedMotion();
  const heroY = prefersReducedMotion ? 0 : useTransform(scrollY, [0,600], [0,180]);
  ```
- [ ] Testar em iPhone SE (375px), iPad, Android – usar Chrome DevTools
- [ ] Touch targets mínimos 44×44px – auditar botões pequenos

---

#### [UI-9] Rotas duplicadas – SEO canibalização

Tens `/app/page.tsx` **E** `/app/[locale]/page.tsx`, `/app/destinations/[slug]/page.tsx` **E** `/app/[locale]/destinations/[slug]/page.tsx`.

2 URLs para o mesmo conteúdo.

**Tarefas:**
- [ ] Escolher 1 estratégia i18n:
  - Opção A: next-intl App Router na root (sem `[locale]` folder)
  - Opção B: pasta `[locale]` – recomendado, já está mais completo
- [ ] Se Opção B:
  - [ ] Apagar duplicatas em `/app/page.tsx`, `/app/destinations/`, `/app/about/`, etc. (manter só `[locale]/*`)
  - [ ] Adicionar redirect em `middleware.ts` de `/destinations/*` → `/{locale}/destinations/*`
  - [ ] Adicionar `<link rel="canonical">` + `hreflang` tags
- [ ] Gerar `sitemap.xml` dinâmico com todas as slugs de destino
- [ ] Adicionar `robots.txt`
- [ ] Validar com Google Search Console após deploy

---

#### [UI-10] Performance – micro-otimizações

**Tarefas:**
- [ ] Framer Motion parallax: já bem usado, mas adicionar `will-change-transform` (já está – bom!)
- [ ] Code splitting: `DestinationMap` (Leaflet) pesa ~150 KB – carregar com `dynamic(..., { ssr: false })`
- [ ] Analisar bundle: `npm run build` + `npx @next/bundle-analyzer`
- [ ] Remover dependências não usadas – `react-helmet-async` com Next.js 15? (Next tem metadata API nativa)
- [ ] Font optimization: já usas `next/font/google` com `display: 'swap'` – bom, manter
- [ ] Preload hero image crítica: `<link rel="preload" as="image">`

---

#### [UI-11] Empty states / erros

**Tarefas:**
- [ ] Página de erro do destino está clean – bom, manter padrão
- [ ] Adicionar empty states para:
  - [ ] Lista de destinos sem resultados (com sugestões)
  - [ ] Hotéis sem disponibilidade
  - [ ] Favoritos vazios
  - [ ] Trips vazias
- [ ] Usar ilustrações consistentes (undraw / lucide icons)
- [ ] Sempre incluir CTA no empty state: "Explorar destinos →"

---

## 5. Roadmap Priorizado

### Sprint 1 – Bloqueadores de Produção (1–2 semanas)

| ID | Tarefa | Área | Esforço |
|---|---|---|---|
| CRIT-ARCH-1 | Service layer + Zod validation | Arch | M |
| CRIT-API-1 | Rate limiting Upstash | API | S |
| CRIT-API-2 | Error handler centralizado | API | S |
| CRIT-DB-3 | Índices trigram + geo | DB | S |
| CRIT-UI-1 | Design tokens – unificar teal/orange | UI | M |
| CRIT-UI-5 | next/image em hero + galeria | UI | S |

### Sprint 2 – Consistência e Dívida Técnica (2–3 semanas)

| ID | Tarefa | Área | Esforço |
|---|---|---|---|
| CRIT-ARCH-3 | Consolidar auth (NextAuth only) | Arch | M |
| CRIT-DB-1 | Migração nomenclatura snake_case | DB | L |
| CRIT-DB-2 | Eliminar modelos duplicados (Payment, Hotel, Activity) | DB | M |
| CRIT-API-3 | Versionamento API – deprecar rotas sem /v1 | API | S |
| CRIT-UI-2 | Destination page → Server Components + ISR | UI | L |
| CRIT-UI-4 | Corrigir tipografia | UI | S |
| UI-9 | Resolver rotas duplicadas / SEO | UI | M |

### Sprint 3 – Enterprise Hardening (2–4 semanas)

| ID | Tarefa | Área | Esforço |
|---|---|---|---|
| ARCH-4 | Zod em todas as API routes | Arch | M |
| DB-4 | PostGIS para geo queries | DB | M |
| DB-5 / DB-6 / DB-7 | Soft delete, N+1, enums pagamento | DB | M |
| API-4 | Cache Redis nas APIs de catálogo | API | S |
| API-5 | OpenAPI / Swagger | API | S |
| API-6 | API Keys middleware | API | M |
| API-7 | Observabilidade Sentry + tracing | API | S |
| UI-6 | Design system completo (Storybook) | UI | M |
| UI-7 | Audit WCAG AA | UI | S |
| UI-8 | Mobile / touch polish | UI | M |

### Backlog

- [ ] API-8 – ml-service docker-compose + CI
- [ ] ARCH-5 – Prisma stub logging
- [ ] ARCH-6 – Landing page Server Component
- [ ] UI-10 – Bundle analysis + micro-optimizations
- [ ] UI-11 – Empty states completos
- [ ] Monorepo – decidir A ou B (CRIT-ARCH-2)
- [ ] CRM duplicado – decisão de produto (CRIT-DB-2)

---

## Resumo Executivo

| Área | Nota | Bloqueador prod? |
|---|---|---|
| Arquitetura de pastas | 6/10 | Sim – falta service layer |
| Modelagem DB | 7/10 | Sim – duplicações + índices |
| APIs | 5/10 | Sim – sem rate limit / validação |
| Auth | 5/10 | Sim – híbrido NextAuth + custom |
| Catálogo travel / ETL | 9/10 | Não – excelente |
| Sistema de design | 5/10 | Sim – tokens não ligados |
| Consistência visual | 6/10 | Sim – cores hardcoded |
| Performance / imagens | 4/10 | Sim – sem next/image, página toda client |
| Acessibilidade | 7/10 | Não – base boa |
| UX / navegação | 7/10 | Não |
| Responsivo / mobile | 7/10 | Não |

**Veredito:** O ETL Wikivoyage / geocoding / OSM é excelente – dá para ver muitas horas de trabalho. O que trava isto de ser "enterprise" é a camada web em cima: falta separação de responsabilidades, validação, consistência no schema, e um design system ligado aos tokens. A UI visual está acima da média para projeto solo.

Com os Sprints 1 + 2 completos, o projeto fica pronto para produção.

---

*Gerado em 2026-06-24 – Auditoria AKMLEVA beta-app*
