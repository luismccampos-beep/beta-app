# Contributing to AKMLEVA

> **Last updated:** June 27, 2026

Welcome! We're thrilled you're interested in contributing to AKMLEVA — an enterprise AI-powered travel platform. This guide covers everything from setting up your development environment to submitting a pull request that meets our quality bar.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style & Linting](#code-style--linting)
- [Testing](#testing)
- [Accessibility Requirements](#accessibility-requirements)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

By participating in this project, you agree to uphold a respectful, inclusive environment for everyone. Harassment, discrimination, and other exclusionary behaviour will not be tolerated.

If you witness or experience misconduct, please contact [support@akmleva.pt](mailto:support@akmleva.pt).

---

## Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | >= 18 | Runtime |
| npm | >= 10 | Package manager |
| Docker | (optional) | Local Postgres, Redis, Valhalla |

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd beta-app

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env — at minimum set DATABASE_URL, AUTH_SECRET

# Start the development server
npm run dev
```

The app runs at [http://localhost:3001](http://localhost:3001).

---

## Development Workflow

1. **Create a branch** from `main` with a descriptive name:

   ```bash
   git checkout -b feat/your-feature-name
   # or: fix/your-bug-fix
   ```

2. **Make changes** — follow the [code style](#code-style--linting) and [accessibility requirements](#accessibility-requirements).

3. **Run checks locally** before committing:

   ```bash
   npm run lint           # Zero warnings expected
   npm run type-check     # TypeScript — no errors
   npm test               # Unit + integration tests
   ```

4. **Write or update tests** — see [Testing](#testing).

5. **Commit with a clear message**:

   ```
   feat: add X feature
   fix: resolve Y bug
   refactor: improve Z structure
   docs: update API documentation
   ```

6. **Push and open a pull request** against `main`.

---

## Code Style & Linting

### ESLint

We use ESLint with flat config (`eslint.config.js`) and enforce **zero warnings**.

Key plugins:
- `@typescript-eslint` — TypeScript rules
- `eslint-plugin-react-hooks` — React Hooks rules
- `eslint-plugin-jsx-a11y` — Accessibility rules (see below)
- `@next/eslint-plugin-next` — Next.js best practices

```bash
npm run lint
```

### TypeScript

Strict mode is enabled. Run the type checker before every commit:

```bash
npm run type-check
```

### Naming Conventions

- **Components**: PascalCase (`DestinationCard`, `VideoPlayer`)
- **Functions**: camelCase (`handleSubmit`, `formatCurrency`)
- **Files**: kebab-case for pages (`destination-detail.tsx`), PascalCase for components (`DestinationCard.tsx`)
- **Interfaces / Types**: PascalCase prefixed with `I`/`T` where disambiguation helps, otherwise plain PascalCase
- **CSS classes**: Tailwind utility classes — avoid custom CSS unless absolutely necessary

### Imports

Order imports as follows (blank line between groups):

1. External libraries (`react`, `next`, `lucide-react`)
2. Internal modules (`@/components/...`, `@/lib/...`)
3. Relative imports (`./utils`, `../types`)
4. CSS / asset imports

---

## Testing

### Unit & Integration Tests

We use **Vitest** with **Testing Library**.

```bash
npm test                  # Run all tests
npm run test:changed      # Run tests on changed files
npm run test:watch        # Watch mode
```

**Writing tests:**

- Place test files next to the module they test with `.test.ts` or `.test.tsx` extension.
- Use `describe` / `it` blocks. Test behaviour, not implementation.
- For React components, render with `@testing-library/react` and assert with `@testing-library/jest-dom` matchers.

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders the heading', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument();
  });
});
```

**Accessibility-specific assertions** (preferred):

```tsx
expect(screen.getByRole('button')).toHaveAccessibleName('Submit');
expect(screen.getByLabelText('Email')).toBeInTheDocument();
expect(screen.getByRole('listbox')).toHaveAttribute('aria-expanded', 'true');
```

### End-to-End Tests

We use **Playwright** for E2E testing, including automated accessibility audits via `@axe-core/playwright`.

```bash
npm run e2e               # All E2E tests
npm run e2e:ui            # Interactive Playwright UI
npm run e2e:a11y          # Accessibility-specific E2E tests (axe-core audits on critical paths)
```

Fixture files go in `e2e/fixtures/`, utilities in `e2e/utils/`.

### Coverage Target

> **80%** line coverage. Run `npm run test:changed:coverage` to check.

---

## Accessibility Requirements

Accessibility is a **first-class requirement** for all UI contributions. See our full [Accessibility Statement](ACCESSIBILITY.md) for context and goals.

### Minimum Standards

All new UI contributions must meet these requirements:

| Requirement | How to check |
|---|---|
| **WCAG 2.1 AA** conformance target | Design and code with AA criteria in mind |
| **Keyboard operable** | Every interactive element must be reachable and operable via keyboard alone |
| **Screen reader compatible** | Use semantic HTML and ARIA attributes where HTML semantics are insufficient |
| **Colour contrast ≥ 4.5:1** | Text over background must pass AA contrast (use tools like the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)) |
| **Visible focus indicators** | Never set `outline: none` without providing an alternative focus style |
| **Form labels** | Every form control must have an associated `<label>` with `htmlFor` / `id` pairing |
| **Images** | Informative images need descriptive `alt` text; decorative images must use `alt=""` |

### Automated Checking

Before marking a PR as ready for review:

```bash
# Run the full lint suite (includes jsx-a11y rules)
npm run lint

# Run unit tests with accessibility assertions
npm test

# Run Playwright axe-core audits (requires dev server)
npm run e2e:a11y
```

#### ESLint jsx-a11y Rules

We enforce 30+ `jsx-a11y` rules in `eslint.config.js`. Key rules that **fail the build** if violated include:

- `jsx-a11y/alt-text` — images must have alt text
- `jsx-a11y/anchor-is-valid` — anchors must have valid href or role
- `jsx-a11y/aria-props` — ARIA attributes must be valid
- `jsx-a11y/click-events-have-key-events` — clickable non-interactive elements must have keyboard handlers
- `jsx-a11y/html-has-lang` — `<html>` must have a `lang` attribute
- `jsx-a11y/label-has-associated-control` — labels must be associated with form controls
- `jsx-a11y/no-static-element-interactions` — static elements must not have interactive handlers without proper roles

> 💡 If a rule is intentionally overridden, add a code comment with `// a11y-ok` and document the rationale in the PR description.

### Component Documentation

When adding new components in Storybook, document:

- **Keyboard interactions** — which keys activate, navigate, or close the component
- **Focus management** — where focus lands on open / close
- **ARIA attributes** — what roles, states, and properties are used
- **Accessibility testing results** — whether axe-core passes

### What Happens in CI

Pull requests will **fail** if they introduce accessibility violations detected by:

1. **ESLint** — jsx-a11y rules (zero-warnings policy)
2. **Vitest** — component tests with accessibility assertions
3. **Playwright + axe** — full-page audits on critical paths

---

## Pull Request Process

1. **Keep PRs focused** — one feature / fix per PR. Large changes should be broken into smaller, reviewable increments.

2. **Fill out the PR template** with:
   - What the change does
   - Screenshots (for UI changes)
   - Testing steps
   - Accessibility checklist (if applicable)

3. **Request review** from at least one maintainer.

4. **Address feedback** — reviewers will look for:
   - Correctness and test coverage
   - Accessibility compliance
   - Adherence to code style
   - No regressions (all existing tests + lint must pass)

5. **Merge** — once approved, a maintainer will squash-merge your PR into `main`.

---

## Reporting Issues

### Bug Reports

Open a [GitHub Issue](https://github.com/luismccampos-beep/beta-app/issues/new) with:

- A clear, descriptive title
- Steps to reproduce
- Expected vs actual behaviour
- Environment (OS, browser, device)
- Screenshots or logs where helpful

### Accessibility Issues

Use the **Accessibility Issue** template at:

> [github.com/luismccampos-beep/beta-app/issues/new](https://github.com/luismccampos-beep/beta-app/issues/new)

This template captures assistive technology, severity, WCAG criteria, and other context specific to accessibility barriers. Issues are triaged within **5 business days** and receive the `a11y` label.

### Feature Requests

Open an issue with the `enhancement` label. Describe the feature, the problem it solves, and any implementation ideas.

---

## Questions?

- **Email:** [support@akmleva.pt](mailto:support@akmleva.pt)
- **GitHub:** open a [discussion](https://github.com/luismccampos-beep/beta-app/discussions)

We aim to respond within **3 business days**.

---

*AKMLEVA is built and maintained by **AKMLEVA Viagens Lda.***
