# AKMLEVA — Agent Guide

## Commands

| Command | Notes |
|---|---|
| `npm run dev` | Dev server on **port 3001** |
| `npm run lint` | ESLint flat config, **zero warnings** enforced |
| `npm run type-check` | `tsc --noEmit`, strict mode |
| `npm test` | Vitest (jsdom). Skips `scripts/__tests__/*.integration.test.*` |
| `npm run test:integration` | Run integration tests only |
| `npm run test:changed` | Vitest on changed files (`--changed`) |
| `npm run test:changed:coverage` | Coverage check (target: 80% lines) |
| `npm run e2e` | Playwright. Starts local dev server unless `BASE_URL` is set |
| `npm run e2e:a11y` | Playwright + axe-core a11y audit |
| `npm run build` | `prisma generate` + `next build` with `DISABLE_SSR_FETCH=true` |
| `npm run start` | `node .next/standalone/server.js` |
| `npm run db:migrate` | `prisma migrate deploy` via wrapper script |
| `npm run db:push` | `prisma db push` (dev only) |
| `npm run storybook:build` | Build Storybook (used by Chromatic CI) |

## Architecture

- **Next.js 15.5 App Router** with `output: 'standalone'`. Monorepo with npm workspaces (`tools/*`).
- **i18n**: `next-intl`, locales `pt|en|es|fr`, `localePrefix: 'never'` (no path prefix). Config at `src/i18n.ts`.
- **Auth**: `next-auth` v5 beta (`5.0.0-beta.31` — version pinned, not ranged). Two auth entrypoints:
  - `src/auth.ts` — full instance with PrismaAdapter (server components, API routes only)
  - `src/auth-edge.ts` — Edge Runtime compatible (middleware only). Warns instead of crashing when `AUTH_SECRET` missing.
  - **Monitoring**: Track [next-auth releases](https://github.com/nextauthjs/next-auth/releases) for stable v5. E2E auth tests at `e2e/auth.spec.ts`. Authenticated E2E requires `E2E_AUTH_TEST_EMAIL` and `E2E_AUTH_TEST_PASSWORD` env vars.
- **Middleware** (`src/middleware.ts`): i18n + auth guard + rate limiting (Upstash Redis) + CORS + URL redirects + 404 logging. Single monolithic file.
- **API proxy**: `/api/v1/:path*` rewrites to `api.akmleva.pt` in production.
- **Prisma**:
  - PostgreSQL via Neon, `relationMode = "foreignKeys"`
  - Build-time stub: during `NEXT_PHASE` ending in `-build` or when `DISABLE_SSR_FETCH=true`, a Proxy stub prevents DB connections. Mutations throw; reads resolve to `[]`.
  - Soft delete via `$extends` on ~15 models (Booking, User, Trip, etc.) — auto-filters `deletedAt: null` on read queries.
  - Schema: snake_case `@map` annotations, all new fields must follow.
- **Workspaces**: npm workspaces at `tools/data-pipeline/` (ETL scripts) and `tools/scrapers/` (web scraping). Web app lives at root with `src/`, `prisma/`, `e2e/`.
- **Packages** (`@akmleva/*`): referenced in `tsconfig.json` paths under `../../packages/` but only `packages/db/` and `packages/shared/` exist as placeholders — not workspace-linked yet.
- **Sentry**: configured at client (`sentry.client.config.ts`), server, and edge.

## Testing Quirks

- Playwright config expects dev server on port **3000** but `npm run dev` serves on **3001**. Test against remote with `BASE_URL=https://...`, or manually adjust.
- Integration tests are excluded from `npm test` — run with `npm run test:integration`.
- Test files: `src/**/*.{test,spec}.{ts,tsx}` and `scripts/**/*.{test,spec}.{js,mjs}`.
- Auth API tests: `src/app/api/auth/__tests__/routes.test.ts` (login, register, forgot-password, reset-password)
- Internal API tests: `src/app/api/internal/__tests__/routes.test.ts` (url-redirects, 404-log)
- API handler tests: `src/lib/api/__tests__/handler.test.ts` (cache headers, validation)
- Rate limit tests: `src/lib/__tests__/rate-limit.test.ts` (tier detection, IP extraction)
- Cron route tests: `src/app/api/cron/__tests__/prisma-migrate.test.ts` (disabled route)
- CI workflows: `ci.yml` (lint, type-check, test, build, e2e), `security-audit.yml` (npm audit, osv-scanner)

## Key Conventions

- ESLint: **zero warnings** — `--max-warnings 0`. jsx-a11y rules are extensive and enforced.
- `legacy-peer-deps=true` (`.npmrc`). The Vercel `installCommand` also uses `--legacy-peer-deps`.
- Postgres on port **5433** (not 5432) via Docker Compose.
- `.env.example` is a binary/git-crypted file. Copy to `.env` and fill in.
- Multiple env files exist: `.env.prod`, `.env.prod2`, `.env.vercel`, `.env.vercel.production`.

## Data Pipeline (Scripts)

~150+ Node.js/Python scripts in `scripts/` for Wikivoyage extraction → bundle building → enrichment → DB import → geocoding. Key order:

```
wikivoyage:extract  →  travel:demo:build  →  travel:demo:enrich-pipeline  →  travel:catalog:import
```

Python scripts require `py -3` (Windows) and explicit UTF-8 mode (`-X utf8`). Pipeline scripts are defined in `tools/data-pipeline/package.json` under the `scripts` section — run them from the workspace dir: `cd tools/data-pipeline && npm run <command>`.

## ML Service

Python FastAPI microservice at `ml-service/`. Provides destination embeddings, recommendations, RAG, TinyAya/Gemini. Pip install extras: `pip install -e ".[all]"`. Docker: `docker compose up ml-service -d`.

## Docker Services

Postgres (5433), Redis (6379), Valhalla (8002), OTP (8080).

## CI/CD

- GitHub Actions: `deploy-migrations.yml` — on push to `main`: CI checks (tsc, lint, tests) → `prisma migrate deploy` → `vercel --prod --yes`.
- Uses `DATABASE_URL_UNPOOLED` for migrations (Neon direct URL, not pooler). Validated in CI.
- `chromatic.yml`: Storybook visual regression on pushes/PRs touching `src/`.
- `accessibility.yml`: axe-core Playwright audit on PRs.
