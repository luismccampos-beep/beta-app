# AKMLEVA — Agent Guide

## Commands

| Command | Notes |
| --- | --- |
| `npm run dev` | Dev server on **port 3002** (Vite) |
| `npm run lint` | ESLint flat config, **zero warnings** enforced |
| `npm run type-check` | `tsc --noEmit`, strict mode |
| `npm test` | Vitest (jsdom). Unit tests only |
| `npm run test:changed` | Vitest on changed files (`--changed`) |
| `npm run test:changed:coverage` | Coverage check (target: 80% lines) |
| `npm run e2e` | Playwright. Starts local dev server unless `BASE_URL` is set |
| `npm run e2e:a11y` | Playwright + axe-core a11y audit |
| `npm run build` | Vite build for Cloudflare Workers |
| `npm run db:migrate` | `prisma migrate deploy` via `@akmleva/db` workspace |
| `npm run db:push` | `prisma db push` (dev only) |

## Architecture

- **TanStack Start** (Vite) with Cloudflare Workers deployment. Monorepo with npm workspaces (`apps/*`, `packages/*`, `tools/*`).
- **i18n**: `createTranslationsHook` from `src/lib/i18n.ts`, locales `pt|en|es|fr`. Translation files in `src/translations/`.
- **Auth**: `better-auth` v1.6+ with Prisma adapter. Server functions via `createServerFn`, session via `getSession()`.
- **Middleware** (`src/middleware/index.ts`): i18n + auth guard (`PROTECTED_PATHS` + `getSession()`) + rate limiting (Upstash Redis) + CORS + URL redirects + 404 logging.
- **API proxy**: `/api/v1/:path*` rewrites to `api.akmleva.pt` in production.
- **Prisma** (via `@akmleva/db`):
  - PostgreSQL, `relationMode = "foreignKeys"`
  - Build-time stub: during `NEXT_PHASE` ending in `-build` or when `DISABLE_SSR_FETCH=true`, a Proxy stub prevents DB connections. Mutations throw; reads resolve to `[]`.
  - Soft delete via `$extends` on ~15 models — auto-filters `deletedAt: null` on read queries.
  - Schema: snake_case `@map` annotations, all new fields must follow.
  - DB scripts live in `packages/db` — root delegates via `npm run db:* -w @akmleva/db`.
- **Workspaces**: npm workspaces at `packages/db/` and `tools/data-pipeline/`. Web app lives at `apps/web-tanstack/`.
- **Packages** (`@akmleva/*`): `packages/db/` (Prisma client), `packages/shared/`, `packages/ui/` (placeholders — not workspace-linked yet).
- **Database schema**: single `packages/db/prisma/schema/schema.prisma` with 130+ models (auth/users, agencies/CRM, destinations, flights, hotels, bookings, payments, trips/itineraries, AI/chat, loyalty, wikivoyage `Wv*` catalog tables, cost-of-living `Col*`, community/content).
- **ML service**: Python FastAPI at `ml-service/` (not an npm workspace). Routes under `app/api/routes/`: recommendations, travel_ranking, travel_distance, personalization, chat, rag, predictions, xai, unified, validate_image. Dev port 3002 (conflicts with web app — run one at a time or override the port).
- **Deployment**: Cloudflare Workers via `wrangler deploy`. Custom domain: `akmleva.pt`. Worker name: `akmleva-web`.

## Testing Quirks

- Playwright config targets port **3002** (Vite preview). Test against remote with `BASE_URL=https://...`.
- Test files: `apps/web-tanstack/src/**/*.{test,spec}.{ts,tsx}` and `apps/web-tanstack/e2e/**/*.spec.ts`.
- ESLint: **zero warnings** — `--max-warnings 0`. jsx-a11y rules are extensive and enforced.
- `legacy-peer-deps=true` (`.npmrc`).
- Postgres on port **5433** (not 5432) via Docker Compose.
- `.env.example` is a binary/git-crypted file. Copy to `.env` and fill in.

## Data Pipeline (Scripts)

~150+ Node.js/Python scripts in `scripts/` for Wikivoyage extraction → bundle building → enrichment → DB import → geocoding. Key order:

```text
wikivoyage:extract  →  travel:demo:build  →  travel:demo:enrich-pipeline  →  travel:catalog:import
```

Python scripts require `py -3` (Windows) and explicit UTF-8 mode (`-X utf8`). Pipeline scripts are defined in `tools/data-pipeline/package.json` under the `scripts` section — run them from the workspace dir: `cd tools/data-pipeline && npm run <command>`.

## ML Service

Python FastAPI microservice at `ml-service/`. Provides destination embeddings, recommendations, RAG, TinyAya/Gemini. Pip install extras: `pip install -e ".[all]"`. Docker: `docker compose up ml-service -d`.

## Docker Services

Postgres (5433), Redis (6379), Valhalla (8002), OTP (8080).

## CI/CD

GitHub Actions workflows (`.github/workflows/`):

- `ci.yml` — Lint → Type Check → Test → Build → E2E
- `deploy-migrations.yml` — on push to `main` (docs excluded): CI checks (tsc, lint, tests via turbo) → `prisma migrate deploy`.
  - Uses `DATABASE_URL_UNPOOLED` for migrations (direct URL, not pooler). Validated in CI; falls back to `DATABASE_URL` if unset.
- `security-audit.yml` — `npm audit`, osv-scanner, dependency review.
- `db-telemetry-prune.yml` — scheduled pruning of DB telemetry/log tables.
- `accessibility.yml` — axe-core Playwright audit on PRs.
