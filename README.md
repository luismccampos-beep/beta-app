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
- [ML Service](#ml-service)
- [Docker Services](#docker-services)
- [CI/CD](#cicd)
- [Testing](#testing)

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.0.0 | UI Framework |
| Next.js | ^15.5.2 | SSR & App Router |
| TypeScript | ^5.6.0 | Type Safety |
| Tailwind CSS | ^4.1.8 | Styling |
| shadcn/ui | via Radix UI | Component Library |
| Framer Motion | ^11.18.2 | Animations |
| next-intl | ^4.1.0 | i18n (pt, en, es, fr) |
| React Query | ^5.90.12 | Server State |
| React Hook Form | ^7.79.0 | Forms |
| Zod | ^4.1.12 | Validation |
| Recharts | ^2.10.3 | Charts |
| Leaflet | ^1.9.4 | Maps |
| Sonner | ^2.0.7 | Toast Notifications |
| React-Toastify | ^11.0.5 | Toast Notifications |

### Backend / Database

| Technology | Version | Purpose |
|---|---|---|
| Node.js | >=20 | Runtime |
| Next.js API Routes | 15.5.2 | API endpoints |
| Prisma ORM | 6.17.1 | Database ORM |
| PostgreSQL (Neon) | 16 | Database principal |
| Redis (Upstash) | ^1.35.6 | Cache / Rate Limiting |
| next-auth | 5.0.0-beta.31 | Authentication |
| Stripe | — | Payment processing |
| Resend | ^6.14.0 | Email sending |

### ML Service

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | ML Runtime |
| FastAPI | — | API Server |
| scikit-learn | — | ML Models |
| pandas | — | Data Processing |
| Gemini API | — | LLM Integration |
| TinyAya | — | On-device LLM |

### DevOps / Infra

| Technology | Proposition |
|---|---|
| Turborepo | Monorepo orchestration |
| Docker | Postgres, Redis, Valhalla, OTP |
| Vercel | Production deployment |
| GitHub Actions | CI/CD |
| Sentry | Error monitoring (client + server + edge) |
| Playwright | E2E tests |
| Vitest | Unit / integration tests |
| Storybook | Component isolation |

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
npm run dev            # Next.js web app (http://localhost:3001)
npm run db:migrate     # Run Prisma migrations
npm run db:seed        # Seed test data
npm run db:studio      # Open Prisma Studio
```

### Production Build

```bash
npm run build
npm run start
```

---

## Project Structure

```
├── .github/workflows/         # CI/CD
│   ├── ci.yml                 # Lint, type-check, test, build, e2e
│   ├── deploy-migrations.yml  # Migrations + Vercel deploy
│   ├── security-audit.yml     # npm audit, osv-scanner, dependency review
│   ├── chromatic.yml          # Storybook visual regression
│   └── accessibility.yml      # axe-core a11y audit
├── apps/                      # Application packages (npm workspaces)
│   └── web/                   # (placeholder for future monorepo split)
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
├── e2e/                       # Playwright E2E tests
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
├── prisma/                    # Prisma schema & migrations
│   ├── migrations/
│   └── schema.prisma          # 200+ models
├── public/                    # Static assets
├── scripts/                   # 150+ automation scripts (legacy location)
│   ├── lib/                   # 23 shared utility modules
│   └── __tests__/
├── src/                       # Next.js App Router
│   ├── app/
│   │   ├── [locale]/          # i18n routes
│   │   ├── api/               # API routes
│   │   ├── dashboard/
│   │   ├── destinations/
│   │   └── ...
│   ├── components/
│   ├── lib/
│   │   ├── api/
│   │   ├── i18n/
│   │   ├── payment/
│   │   ├── travel/
│   │   └── user/
│   └── messages/              # i18n translations (pt, en, es, fr)
├── tools/                     # Workspace tools (npm workspaces)
│   ├── data-pipeline/         # ETL scripts + pipeline package.json
│   └── geocoding/             # Geocoding scripts
├── docker-compose.yml
├── next.config.js
├── turbo.json
├── vitest.config.ts
├── playwright.config.ts
├── sentry.client.config.ts
├── sentry.server.config.ts
├── sentry.edge.config.ts
└── vercel.json
```

---

## Documentation Index

| Document | Description |
|---|---|
| `docs/AUDIT-AKMLEVA.md` | Technical audit: architecture, DB, services, roadmap |
| `docs/Auditoria-2.md` | Second audit: security, stack, improvements plan |
| `docs/DATA_COMPLIANCE.md` | Data source compliance, attribution, and licensing |
| `docs/CULTURAL_DATA_ARCHITECTURE.md` | Cultural data ingestion (museums, UNESCO, OSM) |
| `docs/DESTINATION-CARD-MELHORIAS.md` | Destination card/media improvements |
| `docs/ENHANCED_TRAVEL_PREFERENCES_REFACTORING.md` | Refactor plan for 2k-line form component |
| `docs/ENRICHMENT-SUMMARY.md` | Travel bundle enrichment results |
| `docs/FORMULARIO-MELHORIAS.md` | UX/conversion audit for preferences form |
| `docs/GEOCODING-SUMMARY.md` | Geocoding final state (95.3% hotels geocoded) |
| `docs/NEON_BRANCHING_VERCEL.md` | Neon DB branching with Vercel + Prisma |
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
|---|---|---|
| Root | `./package.json` | Web app dev, build, test, DB |
| Data Pipeline | `tools/data-pipeline/package.json` | Travel data ETL pipeline |
| Scrapers | `tools/scrapers/package.json` | Google Maps & Google Hotels scraping |

### Development (Root)

```bash
npm run dev                   # Start Next.js dev server
npm run build                 # Build for production
npm run start                 # Start production server
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

```
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

## ML Service

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
pip install -r requirements/requirements.txt
uvicorn app.main:app --port 8000
```

Or via Docker:

```bash
docker compose up ml-service -d
```

---

## Docker Services

| Service | Image | Port | Purpose |
|---|---|---|---|
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

**Workflow**: `.github/workflows/deploy-migrations.yml`

- **Trigger**: Push to `main` (excluding docs) + manual dispatch
- **Environment**: Ubuntu latest, Node 20, PostgreSQL
- **Steps**:
  1. Validate database env vars
  2. `npm ci` (triggers Prisma generation)
  3. Resolve failed migrations automatically
  4. `prisma migrate deploy`
  5. Optional: `prisma db seed`

---

## Testing

| Layer | Tool | Command |
|---|---|---|
| Unit / Integration | Vitest | `npm test` |
| Changed-only | Vitest | `npm run test:changed` |
| E2E | Playwright | `npm run e2e` |
| Component | Storybook | `npx storybook dev` |

Coverage target: >80%. Run `npm run test:changed:coverage` to check.

---

## Environment Variables

Key variables (see `.env.example` for full list):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `DATABASE_URL_UNPOOLED` | Direct connection (bypasses Pg Bouncer) |
| `REDIS_URL` | Upstash Redis URL |
| `NEXTAUTH_SECRET` | Auth.js encryption secret (use `AUTH_SECRET` in code) |
| `NEXTAUTH_URL` | App URL for auth callbacks (use `AUTH_URL` in code) |
| `SENTRY_DSN` | Sentry error tracking |
| `RESEND_API_KEY` | Email sending |
| `UNSPLASH_ACCESS_KEY` | Destination images |
| `GOOGLE_MAPS_API_KEY` | Geocoding / Maps |
| `STRIPE_SECRET_KEY` | Payment processing |

---

## License

MIT License — Copyright (c) 2025-2026 AKMLEVA Viagens Lda.

---

## Contact

- Website: [akmleva.com](https://akmleva.com)
- Email: [support@akmleva.pt](mailto:support@akmleva.pt)
- GitHub: [luismccampos-beep/beta-app](https://github.com/luismccampos-beep/beta-app)
