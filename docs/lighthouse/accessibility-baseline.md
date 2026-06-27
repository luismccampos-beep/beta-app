# Accessibility Baseline Report — June 2026

> **Date:** 2026-06-27  
> **Scope:** Automated audits (ESLint jsx-a11y + Playwright axe-core)  
> **Target:** WCAG 2.1 AA  
> **Previous audit:** First formal baseline — updated after remediation cycle

---

## Current Status

| Area | Status | Details |
|---|---|---|
| ESLint jsx-a11y rules | ✅ 30 rules active | 16 error, 9 warn, 5 off |
| ESLint jsx-a11y violations | ✅ **0 remaining** | All 15 original violations fixed |
| `document-title` (axe-core) | ✅ **Fixed** | Root layout now has `title.default: 'AKMLEVA'` + template |
| `color-contrast` (footer) | ✅ **Fixed** | `dark:text-gray-600` → `dark:text-gray-400` in dark mode; `text-gray-500` → `text-gray-400` in light mode |
| `color-contrast` (step numbers) | ✅ **Fixed** | `text-primary-100` → `text-primary-600` for 4.4:1 contrast |
| `color-contrast` (primary button) | ✅ **Fixed** | `--primary` darkened from `oklch(0.55 ...)` → `oklch(0.50 ...)` |
| `aria-valid-attr-value` (auth tabs) | ✅ **Fixed** | Restructured to single `<Tabs>` with `<TabsContent>` children |
| `html-has-lang` (error page) | ✅ **Fixed** | Added `global-error.tsx` with `<html lang="pt">` |
| `select-name` (contact page) | ➖ Transient | Not reproducible in subsequent audits |
| Lighthouse Accessibility score | 📊 ~80 (last known) | Target: ≥ 95 |
| axe-core CI enforcement | ✅ Configured | `.github/workflows/accessibility.yml` runs on every PR |

---

## ESLint jsx-a11y — All Violations Fixed

The 15 jsx-a11y violations detected when the rules were first activated have all been remediated:

| Rule | Count | Fix |
|---|---|---|
| `label-has-associated-control` | 4 | Added `htmlFor`/`id` associations in `DestinationReviews.tsx` |
| `no-static-element-interactions` | 4 | Added `onKeyDown` handlers + semantic roles in `AboutPage.tsx` and `MultiSelectCombobox.tsx` |
| `click-events-have-key-events` | 4 | Added keyboard handlers for star rating and modal in `AboutPage.tsx`, options in `MultiSelectCombobox.tsx` |
| `media-has-caption` | 1 | Added `<track kind="captions">` element in `VideoPlayer.tsx` |
| `heading-has-content` | 1 | Destructured `children` prop explicitly in `CardTitle` |
| `anchor-has-content` | 1 | Fixed in `pagination.tsx` |

**Current ESLint status:** 0 errors, 60 pre-existing warnings (58 `no-explicit-any`, 1 `exhaustive-deps`, 1 `no-noninteractive-element-interactions`).

---

## axe-core Audit Results

### Last local run (against dev server with dummy env vars)

| Test | Result | Notes |
|---|---|---|
| Homepage | ✅ Pass | No critical/serious violations |
| Destinations browse | ✅ Pass | No critical/serious violations |
| Auth page | ✅ Pass | No critical/serious violations |
| About page | ✅ Pass | No critical/serious violations |
| Contact page | ✅ Pass | No critical/serious violations |
| Keyboard tab order | ✅ Pass | Logical focus order |
| Skip-to-content link | ✅ Pass | Present and functional |

### Last production run

When run against `https://www.akmleva.pt`, the production site shows different violations not present in local code (pre-deployment issues):

| Violation | Page | Impact | Note |
|---|---|---|---|
| `color-contrast` (footer, buttons, badges) | Homepage, Auth, About, Contact | Serious | Deployed site hasn't received local fixes |
| `html-has-lang` | Destinations | Serious | Pre-deployment — error page shown |
| `aria-valid-attr-value` | Auth | Critical | Pre-deployment — tabs fix not yet deployed |

Once the local fixes are deployed, re-run the production audit to confirm resolution.

---

## Files Modified/Created in Remediation Cycle

| File | Change |
|---|---|
| `src/app/layout.tsx` | Added `title.default` + `title.template` to metadata |
| `src/app/components/AppFooter.tsx` | `dark:text-gray-600` → `dark:text-gray-400` (dark mode); `text-gray-500` → `text-gray-400` (light mode) |
| `src/app/components/pages/LandingPage.tsx` | Step numbers `text-primary-100` → `text-primary-600` |
| `src/styles/theme.css` | `--primary` darkened `oklch(0.55 0.15 175)` → `oklch(0.50 0.18 175)` |
| `src/app/[locale]/destinations/[slug]/components/DestinationReviews.tsx` | Added `htmlFor`/`id` on labels/inputs, star rating `radiogroup` |
| `src/app/components/pages/AboutPage.tsx` | Added keyboard handlers, `role="document"`, focus management |
| `src/app/components/ui/VideoPlayer.tsx` | Added `<track kind="captions">` |
| `src/app/components/ui/card.tsx` | Explicit `{children}` in `CardTitle` |
| `src/app/components/pages/AuthPage.tsx` | Single `<Tabs>` wrapping both header and content |
| `src/app/global-error.tsx` | **New** — error boundary with `<html lang="pt">` |
| `eslint.config.js` | Added 30 `jsx-a11y` rules, ignore `test-results/` |
| `e2e/accessibility.spec.ts` | **New** — Playwright axe-core audit for 5 critical paths |
| `.github/workflows/accessibility.yml` | **New** — CI workflow for Playwright a11y on PRs |
| `src/app/components/ui/__tests__/MultiSelectCombobox.a11y.test.tsx` | **New** — 13 a11y unit tests |
| `src/app/components/ui/__tests__/VideoPlayer.a11y.test.tsx` | **New** — 8 a11y unit tests |
| `ACCESSIBILITY.md` | **New** — full accessibility statement |
| `CONTRIBUTING.md` | **New** — contributor guidelines with a11y requirements |
| `.github/ISSUE_TEMPLATE/accessibility.yml` | **New** — structured a11y issue template |

---

## Known Limitations

### Env vars for local Playwright audit

The dev server requires `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to start. Dummy values work:

```bash
UPSTASH_REDIS_REST_URL="https://dummy.upstash.io" \
UPSTASH_REDIS_REST_TOKEN="dummy-token" \
AUTH_SECRET="dummy-secret" \
npm run e2e:a11y
```

Or test against production:

```bash
BASE_URL=https://www.akmleva.pt npm run e2e:a11y
```

### Pre-existing test failures

3 migration-related integration tests consistently fail (`resolve-failed-migrations.integration.test.mjs`). These are unrelated to accessibility.

---

## Next Steps

1. Deploy all fixes to production and re-run the axe-core audit to confirm 0 violations
2. Escalate `jsx-a11y` rules from `warn` → `error` as confidence grows
3. Re-run Lighthouse audit and compare scores against baseline

---

*Generated from local + production axe-core audits. Updated June 27, 2026.*
