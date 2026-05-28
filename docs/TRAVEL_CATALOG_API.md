# API interna — catálogo Wikivoyage

Substitui o JSON monolítico (`bundle-wikivoyage.json`) por **Postgres (Vercel Neon)** quando `TRAVEL_CATALOG_SOURCE=db`.

## Porquê Postgres e não só JSON?

| | Bundle JSON | Postgres |
|--|-------------|----------|
| Tamanho | ~100+ MB | Indexado, queries |
| Deploy Vercel | Limite de bundle | Só ligação DB |
| Filtros | Carregar tudo | `?q=&pais=` |
| Atualização | Rebuild manual | `npm run travel:catalog:import` |

Já usa **Prisma + DATABASE_URL** — não é necessário Supabase extra.

## Setup (uma vez)

```bash
# 1. Migração
npm run travel:catalog:migrate
npx prisma migrate deploy   # inclui wv_hotels geo

# 2. Importar bundle + custo de vida (+ listagens opcional)
npm run travel:catalog:import -- --fresh
npm run travel:catalog:import -- --fresh --listings --listings-limit=80000

# 3. Coordenadas nos hotéis (hotel-index.json)
npm run travel:catalog:backfill-geo
```

`.env.local`:

```env
DATABASE_URL="postgresql://..."
DATABASE_URL_UNPOOLED="postgresql://..."
TRAVEL_CATALOG_SOURCE=db
```

## Endpoints (`/api/travel/v1/`)

| Método | Path | Dados |
|--------|------|--------|
| GET | `/destinations?q=Lisboa&pais=Portugal` | Destinos |
| GET | `/destinations/pt-42` | Destino + hotéis + custo de vida + transporte |
| GET | `/hotels?slug=pt-42` | Hotéis do destino |
| GET | `/hotels/nearby?lat=&lng=&radiusKm=10&stars=4` | Hotéis por proximidade (requer geo na DB) |
| GET | `/hotels/12345` | Detalhe do hotel + `mapMarkers` |
| GET | `/hotels/osm?location=` | Hotéis OSM (BizData / Overpass) |
| GET | `/hotels/geocode?q=` | Pesquisa por nome (Photon) |
| GET | `/hotels/:id/image` | Imagem Wikidata → Commons |
| GET/POST | `/hotels/:id/reviews` | Avaliações utilizador (MVP) |

Ver também [OSM_HOTELS.md](./OSM_HOTELS.md).

| GET | `/recommend?nights=&travelers=&origin=&prefs=&budgetFilter=1` | Destinos por regras + custo estimado |

Ver [TRIP_RECOMMENDATION.md](./TRIP_RECOMMENDATION.md).
| GET | `/flights?origin=LIS&destinoId=42` | Voos mock (OpenFlights) |
| GET | `/cost-of-living?city=Lisboa&country=Portugal` | Orçamento diário (CSV) |
| GET | `/listings?slug=pt-42&type=sleep` | Listagens Wikivoyage EN |

Resposta inclui `source: "db" | "bundle"`.

Rota legada: `/api/travel/destinations/[slug]` → delega para v1.

## Tabelas Prisma

- `wv_destinations` — destinos Wikivoyage
- `wv_hotels` — ~370k hotéis (`latitude`, `longitude`, `google_place_id`, `wikidata_id`, `image_url`, `description`)
- `wv_flights` — voos indicativos
- `wv_listings` — sleep/eat/see/do (CSV EN)
- `col_cities` — custo de vida por cidade
- `col_country_indices` — índice por país

## Atualizar dados (cron Vercel)

1. Rebuild bundle local: `npm run travel:demo:build` + enriquecimentos
2. `npm run travel:catalog:import -- --fresh`
3. Cron semanal (exemplo `vercel.json`):

```json
{
  "crons": [
    {
      "path": "/api/cron/travel-catalog-import",
      "schedule": "0 4 * * 0"
    }
  ]
}
```

O endpoint cron deve validar `CRON_SECRET` e chamar o script de import (ou webhook CI).

## Frontend

```ts
const res = await fetch('/api/travel/v1/destinations/pt-42');
const dest = await res.json();
```

Com `TRAVEL_CATALOG_SOURCE` não definido, as rotas v1 usam o **bundle JSON** (comportamento actual).

## Vercel (produção) — corrigir países/hotéis

Os scripts `backfill-dest-geo` / `verify-hotels-geo` **só alteram a base onde correres** (local `localhost:5433` ou Neon).  
A app em [beta-app-tau.vercel.app](https://beta-app-tau.vercel.app) **não herda** automaticamente o que corriste no PC.

### 1) Confirmar o modo actual

Abre (com prefs na URL ou após preencher o formulário):

`https://beta-app-tau.vercel.app/api/travel/v1/recommend?nights=5&travelers=1&origin=LIS&budgetFilter=1&prefs=...`

No JSON, vê o campo **`source`**:

| `source` | Significado |
|----------|-------------|
| `"bundle"` | JSON em `src/data/travel-mock/` (dados antigos / demo) — **sem** backfill Photon |
| `"db"` | Postgres (Neon) — precisa de import + backfills na **mesma** `DATABASE_URL` da Vercel |

### 2) Ativar catálogo na DB (recomendado)

No projeto Vercel → **Settings → Environment Variables** (Production):

```env
TRAVEL_CATALOG_SOURCE=db
DATABASE_URL=postgresql://...   # Neon pooled
DATABASE_URL_UNPOOLED=postgresql://...   # Neon direct (Prisma migrate)
```

Redeploy depois de guardar.

### 3) Popular a Neon (uma vez, a partir do PC)

Com a connection string da **produção** (Vercel → **Storage** → `neon-beta-app` → **Connect**):

> `vercel env pull` e `vercel env run` **não expõem** `DATABASE_URL` da integração Neon (ficam vazios no PC). Copia manualmente do dashboard. O `.env` local com `localhost:5433` sobrepõe a Neon se não o renomeares.

```powershell
# PowerShell — URLs da Neon de PRODUÇÃO (não localhost:5433)
$env:DATABASE_URL = "postgresql://USER:PASS@HOST/DB?sslmode=require"
$env:DATABASE_URL_UNPOOLED = "postgresql://USER:PASS@HOST/DB?sslmode=require"  # direct / unpooled

.\scripts\neon-production-import.ps1 -Fresh -Backfill
```

Ou manualmente (com `.env` renomeado para não usar Docker local):

```powershell
npx prisma migrate deploy
npm run travel:catalog:import -- --fresh --backfill-hotel-geo --backfill-dest-geo --verify-hotels-geo
```

Depois: **Redeploy** em produção (ou `vercel redeploy <url-prod> --target production`) para aplicar `TRAVEL_CATALOG_SOURCE=db`.

Isto importa o bundle Wikivoyage, corrige países (Photon), preenche coords de hotéis e marca hotéis incoerentes como `rejected_geo`.

### 4) Validar em produção

- `GET /api/travel/v1/recommend?...` → `"source": "db"`
- Países coerentes (ex. Munique → Alemanha, não Brasil)
- IATA pode ainda estar errado se `wv_flights` estiver mal — isso é outro backfill (OpenFlights)

### Nota sobre Docker local

`docker compose up -d postgres` só serve para **desenvolvimento local**. A Vercel usa **Neon** (ou outra URL em `DATABASE_URL`), não o Postgres do teu PC.
