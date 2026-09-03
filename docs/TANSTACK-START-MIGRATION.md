# Migração Next.js → TanStack Start — Plano Completo

## Índice

- [Contexto](#contexto)
- [Fase 0 — Preparação](#fase-0--preparação)
- [Fase 1 — Router + Layout Base](#fase-1--router--layout-base)
- [Fase 2 — Autenticação](#fase-2--autenticação)
- [Fase 3 — i18n](#fase-3--i18n)
- [Fase 4 — SEO + Head Management](#fase-4--seo--head-management)
- [Fase 5 — API Routes / Server Functions](#fase-5--api-routes--server-functions)
- [Fase 6 — Middleware](#fase-6--middleware)
- [Fase 7 — UI Components](#fase-7--ui-components)
- [Fase 8 — Data Fetching + State](#fase-8--data-fetching--state)
- [Fase 9 — Deploy + CI/CD](#fase-9--deploy--cicd)
- [Fase 10 — Monitoramento](#fase-10--monitoramento)
- [Fase 11 — Testes](#fase-11--testes)
- [Fase 12 — Cutover](#fase-12--cutover)
- [Orçamento de Tempo](#orçamento-de-tempo)
- [Riscos e Mitigações](#riscos-e-mitigações)
- [Checklist de Validação](#checklist-de-validação)

---

## Contexto

| Aspecto | Atual (Next.js) | Destino (TanStack Start) |
|---|---|---|
| Framework | Next.js 15.5 App Router | TanStack Start v1 RC |
| Build tool | Turbopack/Webpack | Vite 7.x |
| Routing | App Router (file-based, nested layouts) | TanStack Router (file-based, layout routes) |
| SSR | Full RSC + streaming | Client-first, opt-in SSR por rota |
| Server boundary | `'use client'` / `'use server'` | `createServerFn` explícito |
| Deploy | `output: 'standalone'` → Node.js | Nitro (Node.js, Cloudflare Workers, etc.) |
| i18n | next-intl (localePrefix: 'never') | Paraglide ou URL params `{-$locale}` |
| Auth | next-auth v5 beta (5.0.0-beta.31) | Better Auth |
| API routes | Route Handlers (App Router) | Server Routes + Server Functions |
| Monorepo | npm workspaces + Turborepo | Manter |
| Prisma | 153 modelos, soft delete, build stub | Manter `@akmleva/db` package |
| Sentry | `@sentry/nextjs` | `@sentry/node` + `@sentry/react` |

**Escopo actual:**

- ~40 rotas de API
- ~40 páginas (16 componentes de página)
- Auth com 3 providers (Credentials, Google, Facebook)
- i18n com 4 idiomas (pt, en, es, fr)
- 153 modelos Prisma, 20 migrações
- Middleware monolítico (360 linhas, 8 responsabilidades)
- 60+ componentes UI (shadcn/ui + custom)
- 20+ componentes travel
- ML service client com circuit breaker
- Rate limiting (Upstash Redis, 3 tiers)
- CI/CD com 5 GitHub Actions workflows

**POC existente:** `deploy/tanstack-poc/` — hello-world com 2 rotas, Cloudflare Workers, zero integrações.

---

## Fase 0 — Preparação

**Duração:** 1–2 semanas

### 0.1 Integrar o POC ao monorepo

```
deploy/tanstack-poc/  →  apps/web-tanstack/
```

- Mover source code para `apps/web-tanstack/`
- Adicionar `"apps/web-tanstack"` ao `package.json` root `workspaces`
- Configurar `tsconfig.json` com paths `@akmleva/db`, `@akmleva/shared`, `@akmleva/ui`
- Verificar que `turbo.json` inclui o novo workspace nos pipelines `build`, `dev`, `lint`, `type-check`

### 0.2 Estrutura base

```
apps/web-tanstack/
├── src/
│   ├── routes/              # Rotas file-based
│   ├── lib/                 # Utilities (prisma, auth, i18n, etc.)
│   ├── middleware/           # Middleware composável
│   ├── components/          # Componentes React
│   ├── messages/            # JSONs de i18n
│   ├── styles/              # CSS (Tailwind v4)
│   ├── start.ts             # Config global do Start
│   ├── router.tsx           # Router factory
│   ├── client.tsx           # Client hydration
│   └── ssr.tsx              # Server entry
├── public/                  # Assets estáticos
├── vite.config.ts           # TanStack Start plugin + Tailwind v4
├── package.json
└── tsconfig.json
```

### 0.3 Dependências a instalar

```json
{
  "dependencies": {
    "@tanstack/react-start": "^1.168.27",
    "@tanstack/react-router": "^1.170.17",
    "@tanstack/react-query": "^5.90.12",
    "@akmleva/db": "workspace:*",
    "@akmleva/shared": "workspace:*",
    "@akmleva/ui": "workspace:*",
    "better-auth": "^1.x",
    "@paralleldrive/cuid2": "^1.x",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^4.1.12",
    "resend": "^6.14.0",
    "@upstash/ratelimit": "^2.0.7",
    "@upstash/redis": "^1.35.6",
    "bcryptjs": "^3.0.2",
    "@sentry/react": "^10.x",
    "@sentry/node": "^10.x"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@vitejs/plugin-react": "^5.1.1",
    "tailwindcss": "^4.0.0",
    "vite": "^7.3.6",
    "vite-tsconfig-paths": "^5.1.4",
    "typescript": "^5.6.0",
    "vitest": "^4.0.15",
    "@testing-library/react": "^16.x"
  }
}
```

### 0.4 Output esperado

- [ ] `npm run dev` inicia o TanStack Start em `localhost:3000`
- [ ] Rota `/` renderiza uma página hello-world com Tailwind
- [ ] `@akmleva/db` importa e `prisma` funciona no server
- [ ] TypeScript compila sem erros com paths do monorepo

---

## Fase 1 — Router + Layout Base

**Duração:** 1 semana
**Dependências:** Fase 0

### 1.1 Mapeamento de rotas

| Next.js App Router | TanStack Start | Tipo |
|---|---|---|
| `src/app/layout.tsx` | `src/routes/__root.tsx` | Root layout |
| `src/app/page.tsx` | `src/routes/index.tsx` | Landing page |
| `src/app/about/page.tsx` | `src/routes/about.tsx` | Rota simples |
| `src/app/contact/page.tsx` | `src/routes/contact.tsx` | Rota simples |
| `src/app/faq/page.tsx` | `src/routes/faq.tsx` | Rota simples |
| `src/app/auth/page.tsx` | `src/routes/auth.tsx` | Auth page |
| `src/app/auth/reset-password/page.tsx` | `src/routes/auth.reset-password.tsx` | Auth page |
| `src/app/auth/verify-email/page.tsx` | `src/routes/auth.verify-email.tsx` | Auth page |
| `src/app/forgot-password/page.tsx` | `src/routes/forgot-password.tsx` | Auth page |
| `src/app/dashboard/page.tsx` | `src/routes/_protected/dashboard.tsx` | Protected layout |
| `src/app/preferences/page.tsx` | `src/routes/_protected/preferences.tsx` | Protected layout |
| `src/app/preferences/edit/page.tsx` | `src/routes/_protected/preferences.edit.tsx` | Protected layout |
| `src/app/preferences/quick/page.tsx` | `src/routes/_protected.preferences.quick.tsx` | Protected layout |
| `src/app/results/page.tsx` | `src/routes/results.tsx` | Rota simples |
| `src/app/destinations/page.tsx` | `src/routes/destinations.tsx` | Rota simples |
| `src/app/destinations/[slug]/page.tsx` | `src/routes/destinations.$slug.tsx` | Rota dinâmica |
| `src/app/roteiros/[slug]/page.tsx` | `src/routes/roteiros.$slug.tsx` | Rota dinâmica |
| `src/app/legal/[pageType]/page.tsx` | `src/routes/legal.$pageType.tsx` | Rota dinâmica |
| `src/app/not-found.tsx` | Error boundary no root route | |
| `src/app/global-error.tsx` | `src/root.tsx` error handling | |

### 1.2 Root route (`__root.tsx`)

```tsx
// Migrar de src/app/layout.tsx:
// - <html lang={locale}> com Inter font
// - ThemeDetectScript (inline script para theme)
// - Providers tree: SessionProvider > QueryProvider > ThemeProvider > NextIntlProvider
// - AppFooter, AppBottomNav, CookieBanner, Toaster
// - <HeadContent />, <Scripts />, <ScrollRestoration />
// - Metadata global (title template '%s | AKMLEVA', favicon)
```

### 1.3 Layout routes

| Layout route | Propósito | Guard |
|---|---|---|
| `_auth.tsx` | Layout para rotas de auth | Redirect se autenticado |
| `_protected.tsx` | Layout para rotas protegidas | Auth guard (redirect → `/auth`) |
| `_protected/dashboard.tsx` | Layout do dashboard | Auth guard |

### 1.4 Arquivos de configuração

**`vite.config.ts`:**

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tanstackStart(),
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
  ],
})
```

**`tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "paths": {
      "@akmleva/db": ["../../packages/db/src/index"],
      "@akmleva/shared": ["../../packages/shared/src/index"],
      "@akmleva/ui": ["../../packages/ui/src/index"],
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 1.5 Output esperado

- [ ] Todas as rotas listadas aparecem no `routeTree.gen.ts`
- [ ] Navegação entre páginas funciona (client-side)
- [ ] Layout nesting funciona (_auth,_protected)
- [ ] Tailwind CSS aplica estilos corretamente

---

## Fase 2 — Autenticação

**Duração:** 2 semanas
**Dependências:** Fase 1

### 2.1 Substituir next-auth por Better Auth

**Porquê Better Auth:**

- Nativo para TanStack Start / React
- Prisma adapter official
- Server functions nativas (sem catch-all route)
- Suporta Credentials, Google, Facebook providers
- CSRF protection built-in
- Session management via cookies

### 2.2 Estrutura

```
src/lib/auth/
├── auth.ts              # Config Better Auth (Prisma adapter, providers, pages)
├── auth-client.ts       # Client-side helpers (useSession, signIn, signOut)
├── session.ts           # Server session helpers (getSession, requireSession)
└── guards.ts            # requireAdmin(), requireInternalApiKey()
```

### 2.3 Providers

```ts
// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '@akmleva/db'

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  session: { expiresIn: 60 * 60 * 24 * 30 }, // 30 dias
  pages: { signIn: '/auth' },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
    facebook: {
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    },
  },
  providers: [
    // Credentials provider customizado com bcrypt
  ],
})
```

### 2.4 Server routes de auth

| Rota | Método | Handler |
|---|---|---|
| `src/routes/api/auth/$.ts` | GET+POST | Better Auth catch-all handler |
| `src/routes/api/auth/signin.ts` | POST | Credentials login |
| `src/routes/api/auth/signup.ts` | POST | Registo + auto sign-in + email verification |
| `src/routes/api/auth/signout.ts` | POST | Logout |
| `src/routes/api/auth/forgot-password.ts` | POST | Gerar token reset + email |
| `src/routes/api/auth/reset-password.ts` | POST | Validar token + atualizar password |
| `src/routes/api/auth/verify-email.$token.ts` | GET | Verificar email token |
| `src/routes/api/auth/me.ts` | GET+PUT | Perfil do utilizador |
| `src/routes/api/auth/me/password.ts` | PUT | Mudar password |
| `src/routes/api/auth/me/2fa.ts` | GET+POST+DELETE | Setup/enable/disable TOTP |
| `src/routes/api/auth/me/sessions.ts` | GET+DELETE | Listar/revogar sessões |
| `src/routes/api/auth/me/avatar.ts` | POST+DELETE | Upload/apagar avatar |

### 2.5 Route guards

```tsx
// src/middleware/auth.ts
import { createMiddleware, redirect } from '@tanstack/react-start'
import { getSession } from '@/lib/auth/session'

// Guard para layout routes (UX only — redirecionar se não autenticado)
export const authGuard = createMiddleware().server(async ({ next, request }) => {
  const session = await getSession(request)
  if (!session) throw redirect({ to: '/auth' })
  return next({ context: { session } })
})

// Guard para admin (segurança real)
export const adminGuard = createMiddleware()
  .middleware([authGuard])
  .server(async ({ next, context }) => {
    if (context.session.user.role !== 'admin') {
      throw new Error('Forbidden')
    }
    return next()
  })

// Guard para internal API (x-api-key)
export const internalGuard = createMiddleware().server(async ({ next, request }) => {
  const apiKey = request.headers.get('x-api-key')
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    throw new Error('Forbidden')
  }
  return next()
})
```

### 2.6 Migrar módulos existentes

| Módulo atual | Migração |
|---|---|
| `src/auth.ts` (PrismaAdapter + providers) | → `src/lib/auth/auth.ts` (Better Auth config) |
| `src/auth-edge.ts` (JWT only) | → Eliminado (Better Auth usa cookies, sem edge split) |
| `src/auth.config.ts` (callbacks) | → Inline na config Better Auth |
| `src/auth.providers.ts` (Credentials, Google, Facebook) | → Providers no Better Auth config |
| `src/lib/auth-helpers.ts` (requireAdmin) | → `src/lib/auth/guards.ts` |
| `src/lib/auth-internal.ts` (x-api-key) | → `src/lib/auth/guards.ts` (internalGuard) |
| `src/types/next-auth.d.ts` | → Tipos Better Auth |

### 2.7 Variáveis de ambiente

| Variável | Ação |
|---|---|
| `AUTH_SECRET` | Manter (Better Auth usa) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Manter |
| `AUTH_FACEBOOK_ID` / `AUTH_FACEBOOK_SECRET` | Manter |
| `NEXTAUTH_URL` | Remover |
| `NEXTAUTH_URL` | Remover |

### 2.8 Output esperado

- [ ] Login com Credentials funciona (email + password)
- [ ] Login com Google OAuth funciona
- [ ] Login com Facebook OAuth funciona
- [ ] Registo automático + email verification funciona
- [ ] Sessão persiste entre page loads (cookie)
- [ ] Logout limpa sessão
- [ ] Rotas `/dashboard`, `/preferences` redirecionam se não autenticado
- [ ] Rotas `/auth` redirecionam se já autenticado
- [ ] Admin guard funciona para `/api/admin/*`
- [ ] 2FA TOTP setup/enable/disable funciona

---

## Fase 3 — i18n

**Duração:** 1–2 semanas
**Dependências:** Fase 1

### 3.1 Estratégia: Paraglide

**Porquê Paraglide:**

- Plugin Vite nativo — compile-time translations
- Funções tipadas (zero runtime overhead)
- SSR middleware official para TanStack Start
- Suporta `localePrefix: 'never'` via router rewrite
- Detecção automática de locale

### 3.2 Estrutura

```
src/
├── messages/
│   ├── pt.json            # Copiar de apps/web/src/messages/
│   ├── en.json
│   ├── es.json
│   └── fr.json
├── i18n/
│   ├── config.ts          # Locales, defaultLocale, Locale type
│   ├── messages.ts        # Carregar mensagens (Paraglide ou manual)
│   └── provider.tsx       # Provider para client components
```

### 3.3 Configuração Paraglide

```ts
// vite.config.ts
import { paraglide } from '@inlang/paraglide-vite'

export default defineConfig({
  plugins: [
    paraglide({
      project: './project.inlang',
      outdir: './src/paraglide',
    }),
    tanstackStart(),
    // ...
  ],
})
```

### 3.4 Locale detection

```tsx
// src/middleware/locale.ts
import { createMiddleware } from '@tanstack/react-start'
import { locales, defaultLocale } from '@/i18n/config'

export const localeMiddleware = createMiddleware().server(async ({ next, request }) => {
  // Ordem de prioridade: cookie > Accept-Language > default
  const cookieLocale = request.headers.get('cookie')?.match(/locale=([^;]+)/)?.[1]
  const acceptLang = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0]
  const locale = cookieLocale ?? acceptLang ?? defaultLocale

  if (!locales.includes(locale as any)) {
    return next({ context: { locale: defaultLocale } })
  }

  return next({ context: { locale } })
})
```

### 3.5 Router rewrite para `localePrefix: 'never'`

```tsx
// src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),   // /pt/about → /about
      output: ({ url }) => localizeUrl(url),     // /about → /pt/about
    },
  })
}
```

### 3.6 Componentes de tradução

```tsx
// Em components:
import { t } from '@/paraglide/messages'
import { locale } from '@/paraglide/runtime'

function MyComponent() {
  return <h1>{t.welcome({ name: 'User' })}</h1>
}
```

### 3.7 Language Switcher

- Adaptar `src/components/LanguageSwitcher.tsx` para Paraglide
- Matur cookie `locale` + reload (ou navegação suave)
- Manter variantes `'default'` e `'overlay'`

### 3.8 Output esperado

- [ ] Idioma default é `pt`
- [ ] Troca de idioma funciona em todas as páginas
- [ ] Cookie `locale` persiste
- [ ] `Accept-Language` header é respeitado no primeiro visit
- [ ] Traduções são compile-time (zero overhead no bundle)

---

## Fase 4 — SEO + Head Management

**Duração:** 1 semana
**Dependências:** Fases 1, 3

### 4.1 Substituir `generateMetadata` por `head()`

**Padrão Next.js:**

```tsx
export async function generateMetadata({ params }) {
  return {
    title: `${destination.nome} | AKMLEVA`,
    description: destination.resumo,
    openGraph: { title: destination.nome, images: [destination.imagem] },
  }
}
```

**Padrão TanStack:**

```tsx
export const Route = createFileRoute('/destinations/$slug')({
  loader: async ({ params }) => ({
    destination: await getDestination(params.slug),
  }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.destination.nome} | AKMLEVA` },
      { name: 'description', content: loaderData.destination.resumo },
      { property: 'og:title', content: loaderData.destination.nome },
      { property: 'og:description', content: loaderData.destination.resumo },
      { property: 'og:image', content: loaderData.destination.imagem },
      { property: 'og:type', content: 'website' },
    ],
    links: [
      { rel: 'canonical', href: `https://www.akmleva.pt/destinos/${loaderData.destination.slug}` },
      ...localeAlternates(loaderData.destination.slug),
    ],
    scripts: [
      { type: 'application/ld+json', children: JSON.stringify(jsonLd) },
    ],
  }),
})
```

### 4.2 Mapeamento de metadados por rota

| Rota | Title | Descrição (i18n) | Extra |
|---|---|---|---|
| `/` | `AKMLEVA` | `t.landing.description` | og:image logo |
| `/about` | `Sobre Nós` | `t.about.description` | |
| `/contact` | `Contacto` | `t.contact.description` | |
| `/faq` | `Perguntas Frequentes` | `t.faq.description` | |
| `/auth` | `Entrar` | `t.auth.description` | robots: noindex |
| `/dashboard` | `Dashboard` | | robots: noindex |
| `/preferences` | `Preferências` | | robots: noindex |
| `/destinations` | `Destinos` | `t.destinationsBrowse.description` | |
| `/destinations/:slug` | Dynamic | Dynamic (do loader) | JSON-LD, og:image |
| `/roteiros/:slug` | Dynamic | Dynamic (do loader) | JSON-LD |
| `/legal/:type` | Dynamic | Dynamic | |
| `/results` | `Resultados` | `t.results.description` | |

### 4.3 SEO utilities

```tsx
// src/lib/seo.ts — adaptar de apps/web/src/lib/seo.ts
export function generatePageHead(namespace: string, locale: string, extra?: HeadOptions) {
  return {
    meta: [
      { title: t[`${namespace}.title`] },
      { name: 'description', content: t[`${namespace}.description`] },
      { property: 'og:title', content: t[`${namespace}.title`] },
      { property: 'og:description', content: t[`${namespace}.description`] },
      { property: 'og:locale', content: locale },
      ...extra?.meta,
    ],
    links: [
      { rel: 'canonical', href: canonicalUrl },
      ...localeAlternates(path),
      ...extra?.links,
    ],
  }
}
```

### 4.4 Robots e Sitemap

```tsx
// src/routes/api/robots.ts — server route
export const Route = createFileRoute('/api/robots')({
  server: {
    handlers: {
      GET: () => new Response(
        `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /auth/\nDisallow: /dashboard/\nDisallow: /preferences/\n\nSitemap: https://www.akmleva.pt/api/sitemap`,
        { headers: { 'Content-Type': 'text/plain' } }
      ),
    },
  },
})

// src/routes/api/sitemap.ts — server route
export const Route = createFileRoute('/api/sitemap')({
  server: {
    handlers: {
      GET: async () => {
        const sitemap = await generateSitemap()
        return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } })
      },
    },
  },
})
```

### 4.5 Output esperado

- [ ] Title tags formatados corretamente (`%s | AKMLEVA`)
- [ ] OpenGraph tags presentes em todas as páginas
- [ ] Canonical URLs corretas
- [ ] hreflang alternates para 4 idiomas
- [ ] JSON-LD structured data em destinations e roteiros
- [ ] robots.txt servido via API route
- [ ] sitemap.xml gerado dinamicamente

---

## Fase 5 — API Routes / Server Functions

**Duração:** 3–4 semanas
**Dependências:** Fases 1, 2

### 5.1 Padrão de Server Routes

```tsx
// src/routes/api/travel/v1/destinations.ts
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { searchDestinations } from '@/lib/travel/services/destination.service'

const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  q: z.string().optional(),
  country: z.string().optional(),
})

export const Route = createFileRoute('/api/travel/v1/destinations')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const params = Object.fromEntries(url.searchParams)
        const parsed = searchParamsSchema.safeParse(params)

        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        const results = await searchDestinations(parsed.data)
        return Response.json(results, {
          headers: { 'Cache-Control': 'private, no-store' },
        })
      },
    },
  },
})
```

### 5.2 Padrão de Server Functions (data fetching interno)

```tsx
// src/lib/travel/fns/destinations.ts
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { prisma } from '@akmleva/db'

export const getDestinationBySlug = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    return prisma.wvDestination.findUnique({
      where: { slug: data.slug },
      include: { images: true, hotels: true },
    })
  })
```

### 5.3 Mapa completo de migração

#### Auth Routes

| API Atual | TanStack Route | Método | Guard |
|---|---|---|---|
| `api/auth/[...nextauth]` | `api/auth/$.ts` | GET+POST | — |
| `api/auth/login` | `api/auth/signin.ts` | POST | Rate limit: auth |
| `api/auth/register` | `api/auth/signup.ts` | POST | Rate limit: auth |
| `api/auth/logout` | `api/auth/signout.ts` | POST | — |
| `api/auth/forgot-password` | `api/auth/forgot-password.ts` | POST | Rate limit: auth |
| `api/auth/reset-password` | `api/auth/reset-password.ts` | POST | Rate limit: auth |
| `api/auth/verify-email/[token]` | `api/auth/verify-email.$token.ts` | GET | — |
| `api/auth/me` | `api/auth/me.ts` | GET+PUT | authGuard |
| `api/auth/me/password` | `api/auth/me/password.ts` | PUT | authGuard |
| `api/auth/me/2fa` | `api/auth/me/2fa.ts` | GET+POST+DELETE | authGuard |
| `api/auth/me/verify-email` | `api/auth/me/verify-email.ts` | POST | authGuard |
| `api/auth/me/sessions` | `api/auth/me/sessions.ts` | GET+DELETE | authGuard |
| `api/auth/me/avatar` | `api/auth/me/avatar.ts` | POST+DELETE | authGuard |

#### Travel Routes

| API Atual | TanStack Route | Método | Cache |
|---|---|---|---|
| `api/travel/v1/destinations` | `api/travel/v1/destinations.ts` | GET | `s-maxage=300` |
| `api/travel/v1/destinations/$slug` | `api/travel/v1/destinations.$slug.ts` | GET | `s-maxage=3600` |
| `api/travel/v1/destinations/$slug/videos` | `api/travel/v1/destinations.$slug.videos.ts` | GET | `s-maxage=3600` |
| `api/travel/v1/destinations/countries` | `api/travel/v1/destinations/countries.ts` | GET | `s-maxage=3600` |
| `api/travel/v1/hotels` | `api/travel/v1/hotels.ts` | GET | `s-maxage=300` |
| `api/travel/v1/hotels/$id` | `api/travel/v1/hotels.$id.ts` | GET | `s-maxage=300` |
| `api/travel/v1/hotels/$id/reviews` | `api/travel/v1/hotels.$id.reviews.ts` | GET+POST | — |
| `api/travel/v1/hotels/$id/image` | `api/travel/v1/hotels.$id.image.ts` | GET | `s-maxage=86400` |
| `api/travel/v1/hotels/geocode` | `api/travel/v1/hotels.geocode.ts` | GET | `s-maxage=3600` |
| `api/travel/v1/hotels/nearby` | `api/travel/v1/hotels.nearby.ts` | GET | `s-maxage=300` |
| `api/travel/v1/hotels/osm` | `api/travel/v1/hotels.osm.ts` | GET | `s-maxage=300` |
| `api/travel/v1/flights` | `api/travel/v1/flights.ts` | GET | `s-maxage=300` |
| `api/travel/v1/flights/estimate` | `api/travel/v1/flights/estimate.ts` | GET | `s-maxage=300` |
| `api/travel/v1/listings` | `api/travel/v1/listings.ts` | GET | `s-maxage=300` |
| `api/travel/v1/accommodations/search` | `api/travel/v1/accommodations.search.ts` | GET | `s-maxage=300` |
| `api/travel/v1/cost-of-living` | `api/travel/v1/cost-of-living.ts` | GET | `s-maxage=3600` |
| `api/travel/v1/recommend` | `api/travel/v1/recommend.ts` | GET+POST | — |
| `api/travel/v1/sandbox` | `api/travel/v1/sandbox.ts` | GET | — |
| `api/travel/v1/aisstream` | `api/travel/v1/aisstream.ts` | GET | — |
| `api/travel/v1/navitia` | `api/travel/v1/navitia.ts` | GET | `s-maxage=60` |
| `api/travel/v1/transitous` | `api/travel/v1/transitous.ts` | GET | `s-maxage=60` |
| `api/travel/v1/transitland` | `api/travel/v1/transitland.ts` | GET | `s-maxage=60` |

#### User Routes

| API Atual | TanStack Route | Método | Guard |
|---|---|---|---|
| `api/user/preferences` | `api/user/preferences.ts` | GET+PUT | authGuard |
| `api/user/preferences/draft` | `api/user/preferences/draft.ts` | GET+PUT | authGuard |
| `api/user/preferences/analytics` | `api/user/preferences/analytics.ts` | POST | authGuard |

#### Outras Routes

| API Atual | TanStack Route | Método | Guard |
|---|---|---|---|
| `api/contact` | `api/contact.ts` | POST | Rate limit: public |
| `api/ai/preferences-insights` | `api/ai/preferences-insights.ts` | POST | authGuard |
| `api/health` | `api/health.ts` | GET | — |
| `api/health/ml-status` | `api/health/ml-status.ts` | GET | — |
| `api/internal/url-redirects` | `api/internal/url-redirects.ts` | GET | internalGuard |
| `api/internal/url-redirects/$id/visit` | `api/internal/url-redirects.$id.visit.ts` | POST | internalGuard |
| `api/internal/404-log` | `api/internal/404-log.ts` | POST | internalGuard |
| `api/admin/url-redirects` | `api/admin/url-redirects.ts` | GET | adminGuard |
| `api/admin/url-redirects/$id/visit` | `api/admin/url-redirects.$id.visit.ts` | POST | adminGuard |
| `api/admin/404-log` | `api/admin/404-log.ts` | POST | adminGuard |

### 5.4 API proxy `/api/v1/:path*`

```tsx
// src/routes/api/v1/$.ts — proxy para api.akmleva.pt em produção
export const Route = createFileRoute('/api/v1/$')({
  server: {
    handlers: {
      GET: async ({ request }) => proxyToApiV1(request),
      POST: async ({ request }) => proxyToApiV1(request),
      PUT: async ({ request }) => proxyToApiV1(request),
      DELETE: async ({ request }) => proxyToApiV1(request),
    },
  },
})
```

### 5.5 Handler wrapper (substituir apiHandler)

```tsx
// src/lib/api/handler.ts
import { z } from 'zod'

type HandlerFn<T> = (ctx: { data: T; request: Request }) => Promise<Response>

export function apiHandlerWithBody<T>(schema: z.ZodSchema<T>, handler: HandlerFn<T>) {
  return async ({ request }: { request: Request }) => {
    try {
      const body = await request.json()
      const data = schema.parse(body)
      return await handler({ data, request })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json({ error: error.flatten() }, { status: 400 })
      }
      console.error(error)
      return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
  }
}
```

### 5.6 Output esperado

- [ ] Todas as 40+ APIs respondem com mesmo schema JSON
- [ ] Validação Zod funciona em todas as APIs com body
- [ ] Cache headers aplicados corretamente
- [ ] Error responses seguem formato consistente
- [ ] Auth guards funcionam (auth, admin, internal)

---

## Fase 6 — Middleware

**Duração:** 1–2 semanas
**Dependências:** Fase 1

### 6.1 Decompor middleware monolítico

O middleware atual (`src/middleware.ts` — 360 linhas) tem 8 responsabilidades. Decompor em middlewares composáveis:

| Middleware | Responsabilidade | Escopo | Ficheiro |
|---|---|---|---|
| `tenant` | Detectar B2C vs CRM via hostname | Request | `src/middleware/tenant.ts` |
| `cors` | CORS preflight + headers | API routes | `src/middleware/cors.ts` |
| `security-headers` | CSP, HSTS, X-Frame-Options, etc. | Response | `src/middleware/security-headers.ts` |
| `rate-limit` | Upstash Redis sliding window | API routes | `src/middleware/rate-limit.ts` |
| `auth-guard` | Proteger rotas autenticadas | Layout routes | `src/middleware/auth-guard.ts` |
| `admin-guard` | Proteger rotas admin | Admin routes | `src/middleware/admin-guard.ts` |
| `redirects` | URL redirects do banco | Request | `src/middleware/redirects.ts` |
| `404-logging` | Batch logging de 404s | Response | `src/middleware/404-logging.ts` |
| `locale` | i18n locale detection | Request | `src/middleware/locale.ts` |

### 6.2 Registro global

```tsx
// src/start.ts
import { createStart } from '@tanstack/react-start'
import { tenantMiddleware } from './middleware/tenant'
import { corsMiddleware } from './middleware/cors'
import { securityHeadersMiddleware } from './middleware/security-headers'
import { rateLimitMiddleware } from './middleware/rate-limit'
import { localeMiddleware } from './middleware/locale'
import { redirectsMiddleware } from './middleware/redirects'
import { notFoundLoggingMiddleware } from './middleware/404-logging'

export default createStart({
  middleware: [
    tenantMiddleware,
    localeMiddleware,
    corsMiddleware,
    securityHeadersMiddleware,
    rateLimitMiddleware,
    redirectsMiddleware,
    notFoundLoggingMiddleware,
  ],
})
```

### 6.3 Detalhes por middleware

#### Tenant Resolution

```tsx
// src/middleware/tenant.ts
export const tenantMiddleware = createMiddleware().server(async ({ next, request }) => {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  const isCRM = host.startsWith('admin.') || host.includes('oteusite.com')

  return next({
    headers: {
      'x-tenant-kind': isCRM ? 'crm' : 'b2c',
      'x-agency-slug': isCRM ? host.split('.')[0] : undefined,
    },
  })
})
```

#### Rate Limiting

```tsx
// src/middleware/rate-limit.ts — manter Upstash Redis
// 3 tiers: public (30/min), auth (120/min), admin (1000/min)
// Detectar tier: x-api-key → admin; Bearer → auth; else → public
// Falha aberta em dev, falha fechada em prod
```

#### CORS

```tsx
// src/middleware/cors.ts
const ALLOWED_ORIGINS = [
  'https://www.akmleva.pt',
  'https://beta.akmleva.pt',
  'http://localhost:3000',
  'http://localhost:3001',
]

export const corsMiddleware = createMiddleware().server(async ({ next, request }) => {
  const origin = request.headers.get('origin') ?? ''
  const isAPI = new URL(request.url).pathname.startsWith('/api')

  if (!isAPI) return next()

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    })
  }

  return next({ headers: corsHeaders(origin) })
})
```

#### Security Headers

```tsx
// src/middleware/security-headers.ts
export const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  return next({
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  })
})
```

### 6.4 Output esperado

- [ ] Tenant resolution funciona (B2C vs CRM)
- [ CORS headers aplicados em todas as API routes
- [ ] Security headers presentes em todas as respostas
- [ ] Rate limiting funciona com 3 tiers
- [ ] URL redirects funcionam (cache 60s)
- [ ] 404 logging em batch funciona
- [ ] Locale detection funciona

---

## Fase 7 — UI Components

**Duração:** 2–3 semanas
**Dependências:** Fases 1, 3, 4

### 7.1 Categorias de componentes

| Categoria | Qtd | Source | Destino |
|---|---|---|---|
| shadcn/ui primitives | ~60 | `packages/ui/src/` | Importar diretamente |
| Custom UI additions | ~15 | `apps/web/.../ui/` | `src/components/ui/` |
| Page components | ~16 | `apps/web/.../pages/` | `src/components/pages/` |
| Travel components | ~20 | `apps/web/.../travel/` | `src/components/travel/` |
| Dashboard tabs | 4 | `apps/web/.../dashboard/` | `src/components/dashboard/` |
| Layout components | 5 | Providers, Header, Footer, BottomNav, CookieBanner | `src/components/` |
| Custom hooks | 4 | `apps/web/src/hooks/` | `src/hooks/` |

### 7.2 Adaptações por padrão

#### Remover

| Padrão Next.js | Substituir por |
|---|---|
| `'use client'` | Remover (TanStart é client-first) |
| `'use server'` | `createServerFn` |
| `next/image` | `<img>` ou componente otimizado custom |
| `next/link` | `@tanstack/react-router` `<Link>` |
| `next/navigation` (`useRouter`, `useParams`, `useSearchParams`) | TanStack router hooks (`useNavigate`, `useParams`, `useSearch`) |
| `next-intl` (`useTranslations`, `useLocale`) | Paraglide `t()`, `locale()` |
| `next-auth/react` (`useSession`, `signIn`, `signOut`) | Better Auth client |
| `generateMetadata` | Route `head()` |
| `generateStaticParams` | Route `staticData` ou `loader` |
| `export const revalidate = N` | Loader com SWR pattern |
| `export const dynamic = 'force-dynamic'` | `ssr: true` no route |
| `headers()` / `cookies()` (next/headers) | `request` object no handler/middleware |

#### Adicionar

| Novo padrão | Função |
|---|---|
| `loader` | Data fetching server-side antes de renderizar |
| `beforeLoad` | Auth guards, pre-fetch checks |
| `head()` | SEO metadata por rota |
| `validateSearch` | Search params tipados com Zod |
| `createServerFn` | Type-safe server functions |

### 7.3 Exemplo de migração — DestinationCard

```tsx
// ANTES (Next.js):
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export function DestinationCard({ destination }) {
  const t = useTranslations()
  return (
    <Link href={`/destinos/${destination.slug}`}>
      <Image src={destination.imagem} alt={destination.nome} width={400} height={300} />
      <h3>{destination.nome}</h3>
      <p>{t('destinations.country')}</p>
    </Link>
  )
}

// DEPOIS (TanStack):
import { Link } from '@tanstack/react-router'
import { t } from '@/paraglide/messages'

export function DestinationCard({ destination }) {
  return (
    <Link to="/destinations/$slug" params={{ slug: destination.slug }}>
      <img src={destination.imagem} alt={destination.nome} width={400} height={300} loading="lazy" />
      <h3>{destination.nome}</h3>
      <p>{t.destinations_country()}</p>
    </Link>
  )
}
```

### 7.4 Providers

```tsx
// src/components/Providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './ThemeProvider'
import { SessionProvider } from '@/lib/auth/auth-client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
})

export function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
```

### 7.5 Output esperado

- [ ] Todos os componentes shadcn/ui funcionam
- [ ] Page components renderizam corretamente
- [ ] Travel components funcionam (maps, cards, etc.)
- [ ] Nenhum erro de import `next/*`
- [ ] Visual regression test passa (comparar com Next.js)

---

## Fase 8 — Data Fetching + State

**Duração:** 1–2 semanas
**Dependências:** Fases 2, 5

### 8.1 Loaders (data fetching server-side)

```tsx
// Substituir fetch manual em useEffect por loaders:
export const Route = createFileRoute('/destinations/$slug')({
  loader: async ({ params }) => {
    const destination = await getDestinationBySlug({ data: { slug: params.slug } })
    if (!destination) throw notFound()
    return { destination }
  },
  component: DestinationDetail,
})

function DestinationDetail() {
  const { destination } = Route.useLoaderData()
  // Dados já disponíveis, sem loading state necessário
  return <div>{destination.nome}</div>
}
```

### 8.2 TanStack Query (manter)

- Hooks existentes (`useDestinations`, `useCountries`, etc.) funcionam com poucas alterações
- Atualizar fetch URLs para as novas API routes
- Manter staleTime e retry config

### 8.3 Server Functions para mutations

```tsx
// Substituir fetch POST/PUT/DELETE:
const submitReview = createServerFn({ method: 'POST' })
  .validator(z.object({
    destinoId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    return prisma.wvDestinationReview.create({ data })
  })

// Em componentes:
function ReviewForm() {
  const submit = useServerFn(submitReview)
  return (
    <form onSubmit={() => submit({ data: { destinoId: '123', rating: 5 } })}>
      ...
    </form>
  )
}
```

### 8.4 Search params tipados

```tsx
// Substituir manual parsing:
const searchSchema = z.object({
  page: z.coerce.number().default(1),
  q: z.string().default(''),
  country: z.string().optional(),
  sort: z.enum(['name', 'rating', 'cost']).default('name'),
})

export const Route = createFileRoute('/destinations')({
  validateSearch: searchSchema,
  loader: async ({ search }) => {
    return getDestinations({ data: search })
  },
})

function Destinations() {
  const { page, q, country, sort } = Route.useSearch()
  // Tipado e validado automaticamente
}
```

### 8.5 Output esperado

- [ ] Loaders carregam dados antes da renderização
- [ ] Search params são tipados e validados
- [ ] Mutations funcionam via server functions
- [ ] React Query funciona para data fetching client-side
- [ ] Loading/error states funcionam

---

## Fase 9 — Deploy + CI/CD

**Duração:** 2 semanas
**Dependências:** Fases 5, 6

### 9.1 Deploy — Node.js Server (recomendado)

**Build:**

```bash
npm run build  # vite build → .output/
```

**Start:**

```bash
node .output/server/index.mjs
```

**Output structure:**

```
.output/
├── server/
│   └── index.mjs          # Server entry point
├── public/
│   ├── _app/               # Client bundles
│   └── ...                 # Static assets
└── .env                    # Runtime env
```

### 9.2 Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### 9.3 docker-compose.yml (manter)

```yaml
# Manter servicios existentes:
# - postgres:16-alpine (port 5433)
# - redis:7-alpine (port 6379)
# - valhalla (port 8002)
# - otp (port 8080)
# Adicionar:
# - web-tanstack (build from Dockerfile, port 3001)
```

### 9.4 GitHub Actions — Mudanças

#### `ci.yml`

```yaml
# Mudar:
# - npm run build: next build → vite build
# - npm run start: next start → node .output/server/index.mjs
# - Porta: 3001 → 3000 (ou manter 3001)

jobs:
  lint:
    steps:
      - run: npm run lint  # Manter

  type-check:
    steps:
      - run: npm run type-check  # Manter

  test:
    steps:
      - run: npm test  # Manter

  build:
    needs: [lint, type-check, test]
    steps:
      - run: npm run build  # Agora é vite build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .output/

  e2e:
    needs: [build]
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: .output/
      - run: node .output/server/index.mjs &
      - run: npx playwright test
```

#### `deploy-migrations.yml`

- Manter `prisma migrate deploy` inalterado
- O Prisma schema e migrações estão em `packages/db/` — não mudam

#### `accessibility.yml`

- Trocar `npm run start` por `node .output/server/index.mjs`
- Manter axe-core + Playwright audit

#### `chromatic.yml`

- Verificar compatibilidade com Storybook (pode precisar de plugin Vite)
- Manter se compatível

#### `security-audit.yml`

- Manter inalterado

### 9.5 Variáveis de ambiente

| Variável | Ação | Notas |
|---|---|---|
| `DATABASE_URL` | Manter | Prisma |
| `DATABASE_URL_UNPOOLED` | Manter | Migrations |
| `AUTH_SECRET` | Manter | Better Auth |
| `AUTH_GOOGLE_ID/SECRET` | Manter | OAuth |
| `AUTH_FACEBOOK_ID/SECRET` | Manter | OAuth |
| `UPSTASH_REDIS_REST_URL/TOKEN` | Manter | Rate limiting |
| `INTERNAL_API_KEY` | Manter | Server-to-server |
| `RESEND_API_KEY` | Manter | Email |
| `SENTRY_DSN` | Manter | Monitoring |
| `NEXT_PUBLIC_SENTRY_DSN` | Renomear para `VITE_SENTRY_DSN` | Client-side |
| `NEXT_PUBLIC_APP_URL` | Renomear para `VITE_APP_URL` | Client-side |
| `NEXT_PUBLIC_API_URL` | Renomear para `VITE_API_URL` | Client-side |
| `NEXT_PUBLIC_SITE_URL` | Renomear para `VITE_SITE_URL` | Client-side |

### 9.6 Output esperado

- [ ] `npm run build` produz `.output/` com server + client
- [ ] `node .output/server/index.mjs` inicia o servidor
- [ ] Docker build funciona
- [ ] CI pipeline verde (lint, type-check, test, build, e2e)
- [ ] Deploy migrations funciona
- [ ] Accessibility audit passa

---

## Fase 10 — Monitoramento

**Duração:** 1 semana
**Dependências:** Fase 9

### 10.1 Sentry

**Substituir:**

- `@sentry/nextjs` → `@sentry/node` (server) + `@sentry/react` (client)

**Config server:**

```ts
// src/lib/sentry/server.ts
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.2,
  environment: process.env.NODE_ENV,
})
```

**Config client:**

```tsx
// src/lib/sentry/client.ts
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 0.01,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
})
```

**Source maps:**

```ts
// vite.config.ts
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  plugins: [
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    // ...
  ],
})
```

### 10.2 Web Vitals

```tsx
// src/lib/web-vitals.ts
import { onLCP, onFID, onCLS } from 'web-vitals'

export function reportWebVitals() {
  onLCP(console.log)
  onFID(console.log)
  onCLS(console.log)
}
```

### 10.3 ML Service Client

- `src/lib/ml-service/client.ts` → manter lógica existente
- Adaptar imports (não muda muita coisa — é HTTP client)
- Circuit breaker, health check, Sentry propagation — manter

### 10.4 Output esperado

- [ ] Sentry captura erros server e client
- [ ] Source maps uploads funcionam
- [ ] Web vitais reportados
- [ ] ML service health check funciona

---

## Fase 11 — Testes

**Duração:** 2 semanas (paralelas)
**Dependências:** Todas as fases

### 11.1 Unit tests (Vitest)

```ts
// vitest.config.ts — adaptar
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['scripts/__tests__/*.integration.test.*'],
  },
})
```

**Mudanças:**

- Atualizar path aliases
- Substituir imports `next/*` por mocks ou equivalentes
- Testes de API routes → testar server functions diretamente
- Manter coverage threshold (80% linhas)

### 11.2 E2E tests (Playwright)

```ts
// playwright.config.ts — adaptar
import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'node .output/server/index.mjs',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
  },
})
```

**Mudanças:**

- Trocar server start command
- URLs podem mudar (verificar se routes são idênticas)
- Manter testes de auth, preferences, accessibility

### 11.3 A11y tests

- axe-core + Playwright funciona independentemente
- Manter `e2e/accessibility.spec.ts` inalterado

### 11.4 Output esperado

- [ ] Todos os unit tests passam
- [ ] Todos os E2E tests passam
- [ ] A11y audit passa
- [ ] Coverage ≥ 80% linhas

---

## Fase 12 — Cutover

**Duração:** 1 semana
**Dependências:** Todas as fases

### 12.1 Migração gradual

```
1. Fases 0-4  → Setup (sem deploy)
2. Fases 5-6  → APIs e middleware (teste paralelo)
3. Fases 7-8  → UI e data fetching (comparar ambos)
4. Fases 9-10 → Deploy e monitoramento (staging)
5. Fase 11    → Testes completos
6. Fase 12    → Cutover
```

### 12.2 Staging

- Deploy TanStack Start em `beta.akmleva.pt` (já existe)
- Next.js continua em `www.akmleva.pt`
- Testar funcionalidade completa em staging
- Comparar performance (Lighthouse, Core Web Vitals)

### 12.3 DNS switch

1. Validar staging por 1-2 semanas
2. Configurar DNS para apontar para TanStack Start
3. Manter Next.js como backup (desativar depois de 1 semana)
4. Monitorar Sentry para erros pós-migração

### 12.4 Limpeza

- Remover `apps/web/` (Next.js) após validação
- Remover dependências Next.js do root `package.json`
- Atualizar `AGENTS.md` com nova arquitetura
- Atualizar `turbo.json` pipelines

### 12.5 Output esperado

- [ ] `www.akmleva.pt` serve TanStack Start
- [ ] Zero erros no Sentry pós-cutover
- [ ] Performance igual ou melhor
- [ ] Todos os testes passam em produção
- [ ] Próximo deploy funciona via CI/CD

---

## Orçamento de Tempo

| Fase | Duração | Dependências | Pode paralelizar |
|---|---|---|---|
| 0 — Preparação | 1–2 semanas | Nenhuma | — |
| 1 — Router + Layout | 1 semana | Fase 0 | — |
| 2 — Autenticação | 2 semanas | Fase 1 | — |
| 3 — i18n | 1–2 semanas | Fase 1 | Sim (com Fase 2) |
| 4 — SEO | 1 semana | Fases 1, 3 | Sim (com Fase 2) |
| 5 — API Routes | 3–4 semanas | Fases 1, 2 | — |
| 6 — Middleware | 1–2 semanas | Fase 1 | Sim (com Fase 5) |
| 7 — UI Components | 2–3 semanas | Fases 1, 3, 4 | — |
| 8 — Data Fetching | 1–2 semanas | Fases 2, 5 | Sim (com Fase 7) |
| 9 — Deploy + CI/CD | 2 semanas | Fases 5, 6 | — |
| 10 — Monitoramento | 1 semana | Fase 9 | Sim (com Fase 11) |
| 11 — Testes | 2 semanas | Todas | Sim (com Fases 9-10) |
| 12 — Cutover | 1 semana | Todas | — |
| **Total** | **~16–22 semanas** | | |

---

## Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Better Auth incompatível com fluxo 2FA atual | Alto | Média | Prototipar 2FA antes da migração; avaliar @auth/core como alternativa |
| Prisma + Cloudflare Workers não funciona diretamente | Alto | Alta | Usar Node.js server; Cloudflare é opção futura com Prisma Accelerate |
| i18n `localePrefix: 'never'` difícil no TanStack | Médio | Baixa | Paraglide suporta; router rewrite resolve |
| 153 modelos Prisma = build lento | Baixo | Baixa | Prisma generate cached pelo Turbo |
| Perda de SEO durante migração | Alto | Baixa | Manter redirects 301; testar com Google Search Console |
| Componentes shadcn/ui com quebras React 19 | Baixo | Baixa | Testar compatibilidade no POC antes |
| TanStack Start v1 RC tem breaking changes | Médio | Média | Version lock; seguir changelog; testes E2E cobrem regressões |
| Duplo deploy durante transição | Médio | Alta | Feature flags; DNS switch rápido; monitoramento ativo |
| Equipe unfamiliar com TanStack | Médio | Média | 1 semana de onboarding; documentar padrões no AGENTS.md |

---

## Checklist de Validação

### Fase 0 — Preparação

- [ ] POC compila e roda com `npm run dev`
- [ ] `@akmleva/db` importa e `prisma` funciona no server
- [ ] TypeScript compila sem erros com paths do monorepo
- [ ] Turbo detecta o novo workspace

### Fase 1 — Router + Layout

- [ ] Todas as rotas listadas no `routeTree.gen.ts`
- [ ] Navegação client-side funciona
- [ ] Layout nesting funciona (_auth,_protected)
- [ ] Tailwind CSS aplica estilos

### Fase 2 — Autenticação

- [ ] Login com Credentials funciona
- [ ] Login com Google OAuth funciona
- [ ] Login com Facebook OAuth funciona
- [ ] Registo + email verification funciona
- [ ] Sessão persiste entre page loads
- [ ] Logout limpa sessão
- [ ] Auth guards funcionam
- [ ] 2FA TOTP funciona

### Fase 3 — i18n

- [ ] Idioma default é `pt`
- [ ] Troca de idioma funciona
- [ ] Cookie `locale` persiste
- [ ] `Accept-Language` é respeitado

### Fase 4 — SEO

- [ ] Title tags formatados corretamente
- [ ] OpenGraph tags presentes
- [ ] Canonical URLs corretas
- [ ] hreflang alternates para 4 idiomas
- [ ] JSON-LD em destinations e roteiros
- [ ] robots.txt e sitemap.xml funcionam

### Fase 5 — API Routes

- [ ] Todas as 40+ APIs respondem
- [ ] Validação Zod funciona
- [ ] Cache headers aplicados
- [ ] Error responses consistentes

### Fase 6 — Middleware

- [ ] Tenant resolution funciona
- [ ] CORS headers aplicados
- [ ] Security headers presentes
- [ ] Rate limiting funciona
- [ ] URL redirects funcionam
- [ ] 404 logging funciona

### Fase 7 — UI Components

- [ ] shadcn/ui funciona
- [ ] Page components renderizam
- [ ] Travel components funcionam
- [ ] Zero erros de import `next/*`

### Fase 8 — Data Fetching

- [ ] Loaders carregam dados
- [ ] Search params tipados
- [ ] Mutations funcionam
- [ ] React Query funciona

### Fase 9 — Deploy + CI/CD

- [ ] Build produz `.output/`
- [ ] Server inicia corretamente
- [ ] Docker build funciona
- [ ] CI pipeline verde

### Fase 10 — Monitoramento

- [ ] Sentry captura erros
- [ ] Source maps funcionam
- [ ] Web vitais reportados

### Fase 11 — Testes

- [ ] Unit tests passam
- [ ] E2E tests passam
- [ ] A11y audit passa
- [ ] Coverage ≥ 80%

### Fase 12 — Cutover

- [ ] Staging validado por 1-2 semanas
- [ ] DNS switch feito
- [ ] Zero erros pós-cutover
- [ ] Performance validada
- [ ] AGENTS.md atualizado

---

## See Also

- [AUDIT-AKMLEVA.md](./AUDIT-AKMLEVA.md) — audit that recommended the migration
- [ENHANCED_TRAVEL_PREFERENCES_REFACTORING.md](./ENHANCED_TRAVEL_PREFERENCES_REFACTORING.md) — component refactoring in the context of this migration
- [FORMULARIO-MELHORIAS.md](./FORMULARIO-MELHORIAS.md) — form UX improvements planned alongside the migration
- [Documentation Index](./README.md)
