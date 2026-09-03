# AKMLEVA — Enterprise AI Travel Ecosystem

![Status](https://img.shields.io/badge/Status-Enterprise-blue)
![Year](https://img.shields.io/badge/Year-2026-gold)
![License](https://img.shields.io/badge/License-MIT-green)

**AKMLEVA** is an enterprise-grade AI-powered travel platform with a rich destination catalog (28k+ destinations, 415k+ hotels), multi-tenancy for travel agencies, and a sophisticated data pipeline powered by Wikivoyage, Wikidata, GeoNames, and OpenStreetMap.

**Owned and operated by AKMLEVA Viagens Lda.**

---

## Index

- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Documentation Index](#documentation-index)
- [Scripts Reference](#scripts-reference)
- [Data Pipeline](#data-pipeline)
- [ML Service (Python)](#ml-service-python)
- [Docker Services](#docker-services)
- [CI/CD](#cicd)
- [Testing](#testing)

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
| --- | --- | --- |
| React | ^19.0.0 | UI Framework |
| TanStack Start | ^1.168.27 | SSR & Routing (Vite) |
| TypeScript | ^5.6.0 | Type Safety |
| Tailwind CSS | ^4.0.0 | Styling |
| shadcn/ui | via Radix UI | Component Library |
| Framer Motion | ^11.18.2 | Animations |
| better-auth | ^1.6.23 | Authentication |
| React Query | ^5.90.12 | Server State |
| React Hook Form | ^7.83.0 | Forms |
| Zod | ^4.1.12 | Validation |
| Recharts | ^2.15.4 | Charts |
| Leaflet | ^1.9.4 | Maps |
| Sonner | ^2.0.7 | Toast Notifications |

### Backend / Database

| Technology | Version | Purpose |
| --- | --- | --- |
| Node.js | >=20 | Runtime |
| TanStack Server Functions | ^1.168.27 | API endpoints |
| Prisma ORM | 6.17.1 | Database ORM (via `@akmleva/db`) |
| PostgreSQL (Neon) | 16 | Database principal |
| Redis (Upstash) | ^1.38.1 | Cache / Rate Limiting |
| better-auth | ^1.6.23 | Authentication |
| Resend | ^6.17.2 | Email sending |

### ML Service

| Technology | Version | Purpose |
| --- | --- | --- |
| Python | 3.10+ | ML Runtime |
| FastAPI | — | API Server |
| scikit-learn | — | ML Models |
| pandas | — | Data Processing |
| Gemini API | — | LLM Integration |
| TinyAya | — | On-device LLM |

### DevOps / Infra

| Technology | Proposition |
| --- | --- |
| Turborepo | Monorepo orchestration |
| Docker | Postgres, Redis, Valhalla, OTP |
| Cloudflare Workers | Production deployment (TanStack Start) |
| Wrangler | Cloudflare CLI for deploy |
| GitHub Actions | CI/CD |
| Playwright | E2E tests |
| Vitest | Unit / integration tests |

---

## Quick Start

### Prerequisites

```bash
node --version   # >=20
npm --version    # >=10
docker           # optional, for local Postgres/Redis
```

### Installation

```bash
git clone <repo-url>
cd beta-app
npm install
cp .env.example .env
# Edit .env with DATABASE_URL, REDIS_URL, etc.
```

### Development

```bash
npm run dev            # TanStack Start dev server (http://localhost:3002)
npm run db:migrate     # Run Prisma migrations
npm run db:seed        # Seed test data
npm run db:studio      # Open Prisma Studio
```

### Production Build

```bash
npm run build          # Vite build for Cloudflare Workers
npm run deploy         # Build + wrangler deploy
```

---

## Project Structure

```text
├── .github/workflows/         # CI/CD
│   ├── ci.yml                 # Lint, type-check, test, build, e2e
│   ├── deploy-migrations.yml  # CI checks + Prisma migrate deploy (push to main)
│   ├── security-audit.yml     # npm audit, osv-scanner, dependency review
│   ├── db-telemetry-prune.yml # Scheduled pruning of DB telemetry/log tables
│   └── accessibility.yml      # axe-core a11y audit
├── apps/                      # Application packages (npm workspaces)
│   └── web-tanstack/          # TanStack Start app (Vite, Cloudflare Workers)
├── configs/                   # TypeScript shared configs
├── data/                      # Raw data: dumps, caches, exports
│   ├── cost-of-living/
│   ├── geonames-cache/
│   ├── hotels/
│   ├── opentripplanner/
│   ├── pbf/
│   ├── reports/
│   ├── transportation/
│   └── wikivoyage/
├── docs/                      # Technical documentation
│   └── lighthouse/
├── ml-service/                # Python FastAPI ML microservice
│   ├── app/
│   │   ├── api/routes/
│   │   ├── ml/
│   │   ├── models/
│   │   └── pipelines/
│   ├── Dockerfile
│   └── pyproject.toml
├── packages/                  # Shared packages (npm workspaces)
│   ├── db/                    # @akmleva/db — Prisma client
│   ├── shared/                # @akmleva/shared — shared utilities
│   └── ui/                    # @akmleva/ui — shared UI components
├── scripts/                   # 150+ automation scripts
│   ├── lib/                   # 23 shared utility modules
│   └── __tests__/
├── tools/                     # Workspace tools (npm workspaces)
│   ├── data-pipeline/         # ETL scripts + pipeline package.json
│   └── Database/              # Auxiliary datasets (restaurants, etc.)
├── docker-compose.yml
├── turbo.json
└── apps/web-tanstack/wrangler.jsonc  # Cloudflare Workers config
```

---

## Documentation Index

| Document | Description |
| --- | --- |
| `docs/AUDIT-AKMLEVA.md` | Technical audit: architecture, DB, services, roadmap |
| `docs/Auditoria-2.md` | Second audit: security, stack, improvements plan |
| `docs/DATA_COMPLIANCE.md` | Data source compliance, attribution, and licensing |
| `docs/CULTURAL_DATA_ARCHITECTURE.md` | Cultural data ingestion (museums, UNESCO, OSM) |
| `docs/DESTINATION-CARD-MELHORIAS.md` | Destination card/media improvements |
| `docs/ENHANCED_TRAVEL_PREFERENCES_REFACTORING.md` | Refactor plan for 2k-line form component |
| `docs/ENRICHMENT-SUMMARY.md` | Travel bundle enrichment results |
| `docs/FORMULARIO-MELHORIAS.md` | UX/conversion audit for preferences form |
| `docs/GEOCODING-SUMMARY.md` | Geocoding final state (95.3% hotels geocoded) |
| `docs/OSM_HOTELS.md` | OpenStreetMap hotel integration |
| `docs/SCHEMA_MIGRATION_PLAN.md` | Planned DB migrations |
| `docs/SCHEMA_REFACTORING_PHASE2.md` | Phase 2 schema refactoring |
| `docs/TRAVEL_CATALOG_API.md` | Internal Wikivoyage catalog API |
| `docs/TRIP_RECOMMENDATION.md` | Smart trip recommendations MVP |
| `docs/VIDEOS-DESTINO-IMPLEMENTACAO.md` | Video on destination cards |
| `ACCESSIBILITY.md` | Accessibility statement, goals, and reporting guide |
| `CONTRIBUTING.md` | Contribution guidelines, accessibility requirements, and PR process |
| `docs/wikivoyage_links.md` | Wikivoyage links reference |
| `docs/lighthouse/` | Lighthouse audit reports (home, about, destinations) |

---

## Scripts Reference

Scripts are organized into npm workspace packages for maintainability:

| Workspace | Location | Purpose |
| --- | --- | --- |
| Root | `./package.json` | Web app dev, build, test, DB |
| Data Pipeline | `tools/data-pipeline/package.json` | Travel data ETL pipeline |
| ML Service | `ml-service/package.json` | Python FastAPI ML microservice scripts |

### Development (Root)

```bash
npm run dev                   # Start TanStack Start dev server (port 3002)
npm run build                 # Vite build for Cloudflare Workers
npm run deploy                # Build + wrangler deploy
npm run lint                  # ESLint (zero warnings)
npm run type-check            # TypeScript validation
```

### Database (Root)

```bash
npm run db:migrate            # Deploy migrations to database
npm run db:push               # Push schema changes (dev only)
npm run db:seed               # Seed database
npm run db:reset              # Reset database (destructive)
npm run db:studio             # Open Prisma Studio
npm run db:resolve            # Resolve failed migrations
```

### Testing (Root)

```bash
npm test                  # Run all unit/integration tests
npm run test:changed      # Run tests on changed files only
npm run test:watch        # Watch mode
npm run e2e               # Playwright E2E tests
npm run e2e:ui            # Playwright interactive UI
```

### Data Pipeline (`tools/data-pipeline/`)

Run from the workspace directory or use `npm run -w`:

```bash
cd tools/data-pipeline

# Wikivoyage Extraction
npm run wikivoyage:extract         # Parse both PT + EN dumps
npm run wikivoyage:extract:pt      # Parse Portuguese dump only
npm run wikivoyage:extract:en      # Parse English dump only

# Travel Bundle Pipeline
npm run travel:demo:build           # Build bundle from parsed Wikivoyage
npm run travel:demo:cards           # Enrich destination cards
npm run travel:demo:enrich-external # Enrich with external data
npm run travel:demo:enrich-transport
npm run travel:demo:enrich-budget
npm run travel:demo:rebuild-flights
npm run travel:demo:enrich-weather
npm run travel:demo:enrich-hotels
npm run travel:demo:enrich-hotels-from-db
npm run travel:demo:enrich-cultural-pois
npm run travel:demo:enrich-hospitals-police
npm run travel:demo:enrich-rental-cars
npm run travel:demo:enrich-overture
npm run travel:demo:enrich-pipeline  # Full enrichment pipeline
npm run travel:demo:patch-countries

# Catalog & Database Import
npm run travel:catalog:import
npm run travel:catalog:sync-images
npm run travel:catalog:tag-categorias
npm run travel:catalog:classify-hotels
npm run travel:catalog:verify-hotels-geo

# Geocoding
npm run travel:catalog:geocode-hotels:parallel
npm run travel:catalog:geocode-hotels:combined
npm run travel:catalog:geocode-from-geonames
npm run travel:catalog:geocode-dest-geonames

# External Data Fetching
npm run travel:fetch:wikidata-cultural
npm run travel:fetch:wikipedia-airports
npm run travel:fetch:wikipedia-hotels
npm run travel:fetch:wikipedia-hotel-chains

# Wiki Pipeline
npm run travel:wiki:pipeline
npm run travel:wiki:status

# Images
npm run travel:images:enrich
npm run travel:images:dedupe
npm run travel:images:status

# ML Feature Export
npm run travel:ml:export

# Routing Engines
npm run valhalla:up
npm run otp:up
```

---

## Data Pipeline

The destination catalog is built through a multi-stage data pipeline:

```text
Wikivoyage XML Dumps (PT + EN)
    │
    ▼
  parse-wikivoyage-dump.py    → JSONL listings
    │
    ▼
  build-travel-bundle          → bundle.json (28k+ destinations)
    │
    ▼
  Enrichment Pipeline:
  ├── GeoNames (coordinates, populations)
  ├── Wikidata (cultural POIs, UNESCO sites)
  ├── OpenStreetMap / Overpass (hospitals, police, amenities)
  ├── Overture Maps (global POI data)
  ├── Unsplash (destination images)
  ├── Weather data
  ├── Cost-of-living data
  ├── Transport data (flight routes)
  └── Hotel data (Wikivoyage, MakeMyTrip, Google Hotels)
    │
    ▼
  Import to PostgreSQL (Neon) via Prisma
    │
    ▼
  Geocoding pipeline:
  ├── GeoNames
  ├── Google Maps API
  ├── Photon (OpenStreetMap)
  └── LocationIQ
```

---

## ML Service (Python)

The Python microservice (`ml-service/`) provides:

- **Destination embeddings** — scikit-learn based semantic similarity
- **Travel recommendations** — preference-based ranking
- **Personalization** — user preference prediction
- **Conversational AI** — TinyAya / Gemini integration
- **RAG** — Retrieval-Augmented Generation for travel queries
- **Sustainability scoring** — carbon/sustainability prediction
- **Explainable AI** — feature importance for recommendations

Start the service:

```bash
cd ml-service
pip install -e ".[all]"     # or: npm run install:all
npm run dev                 # uvicorn app.main:app --port 3002 --reload
```

> **Note:** the ML service dev server also uses port **3002** — if running the web app locally at the same time, start one of them on a different port (e.g. `uvicorn app.main:app --port 8000`).

Or via Docker:

```bash
docker compose up ml-service -d
```

---

## Docker Services

| Service | Image | Port | Purpose |
| --- | --- | --- | --- |
| `postgres` | postgres:16-alpine | 5433 | Main database |
| `redis` | redis:7-alpine | 6379 | Caching / sessions |
| `valhalla` | gis-ops/docker-valhalla | 8002 | OSM routing engine |
| `otp` | opentripplanner/opentripplanner | 8080 | Transit routing (GTFS) |

```bash
docker compose up -d                    # Start all services
docker compose up postgres redis -d     # Start only DB + cache
```

---

## CI/CD

### Deploy Migrations Workflow

**Workflow**: `.github/workflows/deploy-migrations.yml`

- **Trigger**: Push to `main` (excluding docs) + manual dispatch
- **Environment**: Ubuntu latest, Node 22, PostgreSQL
- **Steps**:
  1. Validate database env vars
  2. `npm ci` (triggers Prisma generation via `@akmleva/db`)
  3. Resolve failed migrations automatically
  4. `prisma migrate deploy`
  5. Optional: `prisma db seed`

### Other CI Workflows

- **`ci.yml`** — Lint → Type Check → Test → Build → E2E
- **`security-audit.yml`** — `npm audit`, osv-scanner, dependency review
- **`db-telemetry-prune.yml`** — Scheduled pruning of DB telemetry/log tables
- **`accessibility.yml`** — axe-core Playwright audit on PRs

---

## Testing

| Layer | Tool | Command |
| --- | --- | --- |
| Unit / Integration | Vitest | `npm run test:tanstack` |
| Changed-only | Vitest | `npm run test:changed:tanstack` |
| E2E | Playwright | `npm run e2e:tanstack` |
| A11y audit | Playwright + axe-core | `npm run e2e:a11y:tanstack` |

Coverage target: >80%. Run `npm run test:changed:coverage:tanstack` to check.

---

## Deployment

The app deploys to **Cloudflare Workers** via `wrangler deploy`.

### Development Server

```bash
npm run dev                    # Vite dev server (port 3002)
```

### Build & Deploy

```bash
npm run build                  # Vite build
npm run deploy                 # wrangler deploy
# Or use the tanstack-specific script:
npm run build:tanstack && npm run -w apps/web-tanstack deploy
```

### Deployment Configuration

- **`apps/web-tanstack/wrangler.jsonc`** — Cloudflare Workers config (compatibility flags, custom domain)
- **`apps/web-tanstack/vite.config.ts`** — Vite with TanStack Start and Cloudflare plugins
- **`apps/web-tanstack/package.json`** — Dependencies

### Notes

- Custom domain: `akmleva.pt`
- Worker name: `akmleva-web`
- Database: PostgreSQL (Neon) via Prisma (`@akmleva/db`) with driver adapters (`@prisma/adapter-pg` + Hyperdrive) on Workers

---

## Environment Variables

Key variables (see `.env.example` for full list):

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `DATABASE_URL_UNPOOLED` | Direct connection (bypasses Pg Bouncer) |
| `REDIS_URL` | Upstash Redis URL |
| `AUTH_SECRET` | better-auth encryption secret |
| `BETTER_AUTH_URL` | App URL for auth callbacks |
| `SENTRY_DSN` | Sentry error tracking |
| `RESEND_API_KEY` | Email sending |
| `UNSPLASH_ACCESS_KEY` | Destination images |
| `GOOGLE_MAPS_API_KEY` | Geocoding / Maps |

---

## License

MIT License — Copyright (c) 2025-2026 AKMLEVA Viagens Lda.

---

## Contact

- Website: [akmleva.com](https://akmleva.com)
- Email: [support@akmleva.pt](mailto:support@akmleva.pt)
- GitHub: [luismccampos-beep/beta-app](https://github.com/luismccampos-beep/beta-app)
