# Accessibility Statement — AKMLEVA

> **Last updated:** June 27, 2026  
> **Applies to:** [www.akmleva.com](https://www.akmleva.com) and related subdomains  
> **Owner:** AKMLEVA Viagens Lda.

AKMLEVA is committed to making our AI-powered travel platform accessible to the widest possible audience, regardless of ability or the technology used to access it. We believe travel discovery is a universal right and that the tools we build should reflect that.

---

## Our Commitment

We aim to meet the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** as our primary conformance target. Where achieving AA is not immediately feasible, we document the gap, provide a workaround, and track progress publicly.

### Why accessibility matters to AKMLEVA

- **Travel is for everyone.** Booking a trip, researching a destination, or comparing hotels should never be blocked by a barrier in our interface.
- **We serve a global audience.** Our platform supports 4 languages (Portuguese, English, Spanish, French) and reaches users across different devices, network conditions, and assistive technologies.
- **We build with AI, not at the expense of inclusion.** Our destination recommendations, chat, and personalisation features are designed to work with assistive technology from day one.

---

## Measurable Goals

| Goal | Target | Status |
|---|---|---|
| WCAG 2.1 Level AA conformance | Full AA | ![In progress](https://img.shields.io/badge/Status-In%20Progress-yellow) |
| Lighthouse Accessibility score | ≥ 95 | ![Current: ~80](https://img.shields.io/badge/Current-%7E80-orange) |
| axe-core audit (automated) | Zero critical/serious violations | ![In progress](https://img.shields.io/badge/Status-In%20Progress-yellow) |
| Keyboard-only navigation | All interactive features reachable and operable | ![In progress](https://img.shields.io/badge/Status-In%20Progress-yellow) |
| Screen reader testing | VoiceOver (macOS), NVDA (Windows), TalkBack (Android) | ![Planned](https://img.shields.io/badge/Status-Planned-lightgrey) |

Progress is tracked in our internal audit (see [`docs/AUDIT-AKMLEVA.md`](docs/AUDIT-AKMLEVA.md), section UI-7).

---

## How We Meet Accessibility Standards

### Keyboard Navigation

- All interactive elements (links, buttons, form controls, cards) are focusable and operable via keyboard.
- Focus order follows a logical reading flow — it matches the visual layout (top-to-bottom, left-to-right).
- Skip-to-content links are provided on every page.
- Focus indicators are visible and meet the 3:1 contrast ratio minimum.

### Screen Reader Support

- We use semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`) to convey page structure.
- Landmark regions are labelled where multiple instances exist (e.g., `aria-label="Main navigation"`, `aria-label="Footer navigation"`).
- Dynamic content updates (e.g., search results, destination lists) use `aria-live` regions so screen readers announce changes without disrupting the user.
- Our UI component library (shadcn/ui, built on Radix UI) is chosen for its built-in ARIA attributes, focus management, and keyboard support out of the box.
- Form inputs, error messages, and validation states are associated programmatically (`aria-describedby`, `aria-invalid`, `aria-errormessage`).

### Colour and Contrast

- All text meets or exceeds WCAG AA contrast ratios (4.5:1 for body text, 3:1 for large text).
- Colour is never used as the sole means of conveying information — we pair icons, labels, and text with colour cues.
- The platform supports system-wide dark mode without losing contrast or readability.
- Gradient accents (e.g., the primary-to-accent hero banners) maintain sufficient contrast against overlaid text.

### Captions, Transcripts, and Media

- Destination videos published on the platform are accompanied by:
  - **Captions** — human-edited where possible, auto-generated as a fallback.
  - **Transcripts** — full-text transcript linked below each video.
- No media auto-plays on page load. Videos require a user gesture to start.
- Important visual actions in demo or tutorial videos are described verbally.

### Images and Icons

- Informative images carry meaningful `alt` text describing the content and purpose of the image (see the [W3C alt Decision Tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)).
- Decorative images use `alt=""` (empty alt) so screen readers ignore them.
- Icons used as interactive controls have accessible labels (`aria-label` or visually hidden text).
- Complex images (architecture diagrams, data visualisations) include a text alternative or a bullet-point summary adjacent to the image.

### Forms and Inputs

- Every form field has an associated `<label>`.
- Required fields are marked visually (`*`) and programmatically (`aria-required="true"`).
- Error messages are clear, specific, and placed inline near the field they describe.
- Multi-step forms (e.g., travel preferences) provide step indicators and announce the current step via `aria-current="step"`.

---

## Known Limitations & Workarounds

| Limitation | Impact | Workaround | Tracking |
|---|---|---|---|
| Accessibility audit is ongoing — some older pages may not meet AA standards | Users may encounter focus-order issues or missing ARIA labels on legacy pages | Use the browser’s zoom (up to 200 %) and custom stylesheets as a temporary workaround | [#UI-7 audit](docs/AUDIT-AKMLEVA.md) |
| Interactive maps (Leaflet) have limited keyboard-driven pan & zoom | Users relying on keyboard may find maps difficult to navigate | Hotel and destination information is available in list/card format as an alternative | Tracking in audit |
| AI chat recommendations may not be fully accessible in every turn | Screen reader users may miss dynamically inserted recommendation cards | Use the "Share as text" button to receive a plain-text summary of recommendations | Tracking in audit |
| Some third-party embedded content (videos, booking widgets) may not fully conform | Users may experience inconsistent accessibility across embedded content | We work with vendors to improve — report specific issues via the template below | Report via issue template |

We actively reduce this list. Each limitation has a target resolution milestone.

---

## Contributor Requirements

If you contribute code, documentation, or design to AKMLEVA, accessibility is a first-class requirement — not an afterthought.

### Testing

All UI changes **must** be tested with an accessibility testing tool before being marked ready for review:

```bash
# Run axe-core on localhost (manual)
npx @axe-core/cli http://localhost:3001/<path>

# Run Storybook a11y tests (component-level)
npx storybook dev   # Opens Storybook — check the "Accessibility" tab
```

Our automated tests include:

- **`@storybook/addon-a11y`** — checks every component story for violations during Storybook development.
- **`@testing-library/jest-dom`** — `toHaveAccessibleName()`, `toHaveAccessibleDescription()`, `toHaveAttribute()` assertions on rendered components.
- **Playwright E2E** — axe-core integration for full-page audits on critical paths (home, search, destination detail, checkout).

### Documentation

When adding new components, follow these documentation guidelines:

- **SVGs / Icons:** Provide `aria-label` or `title` elements. Use `aria-hidden="true"` for purely decorative icons.
- **Images:** Always include `alt` text. If the image conveys information, describe it. If it is decorative, use `alt=""`.
- **Interactive elements:** Document keyboard interactions, focus management, and any `aria-*` attributes in the component’s Storybook story.
- **Colour:** Do not rely on colour alone to convey meaning. Pair colour cues with text labels or icons.

### CI/CD

Pull requests will **fail** if they introduce accessibility violations detected by our linting or testing workflow:

1. **ESLint:** `jsx-a11y` rules are enforced (e.g., `alt-text`, `anchor-has-content`, `click-events-have-key-events`, `label-has-associated-control`).
2. **Vitest:** Component tests that include accessibility assertions must pass.
3. **Playwright + axe:** Full-page audits on changed routes must not introduce critical or serious violations.

> 💡 If a rule is intentionally overridden, document the rationale in the PR description and add a code comment with `// a11y-ok`.

---

## Supported Environments

| Platform | Support Level | Notes |
|---|---|---|
| **Web (desktop)** | ✅ Full | Windows, macOS, Linux — latest 2 major versions of Chrome, Firefox, Safari, Edge |
| **Web (mobile)** | ✅ Full | iOS Safari, Android Chrome — responsive layout down to 320 px width |
| **Terminal / CLI** | ❌ Not applicable | Data scripts are not user-facing |
| **iOS app** | ⏳ Planned | |
| **Android app** | ⏳ Planned | |

---

## Reporting Accessibility Bugs

We want to hear about barriers you encounter. Please use the **Accessibility Issue Template** so we can triage and resolve issues quickly.

1. Go to [github.com/luismccampos-beep/beta-app/issues/new](https://github.com/luismccampos-beep/beta-app/issues/new)
2. Choose the **"Accessibility Issue"** template
3. Fill in the required fields:
   - **URL** where the issue occurred
   - **Assistive technology** used (screen reader, switch device, magnifier, etc.)
   - **Operating system** and **browser** versions
   - **Severity** — how much does this block you?
   - **Description** — what happened and what did you expect?
   - **Steps to reproduce** — so we can reproduce the issue
4. Submit the issue

### What happens after you report

1. The issue receives the `a11y` label and is triaged within **5 business days**.
2. We acknowledge the report, provide an expected resolution timeline, or suggest a workaround.
3. When a fix is deployed, we comment on the issue and close it.

> **⚠️ Expectations:** Accessibility bugs are prioritised alongside critical production issues because they can block a user from using the platform entirely. If we can't resolve immediately, we will provide a documented workaround and track the fix in a publicly visible issue.

---

## Documentation Accessibility

Our documentation is often the first interface users and contributors touch. We make sure everyone can read it.

### Structure and Semantics

- We use a logical heading hierarchy (`#` → `##` → `###` → `####`) and never skip levels.
- Links use unique, descriptive text — "Read the contributing guide" instead of "click here".
- We use plain language, avoid unnecessary jargon, and expand abbreviations on first use (e.g., **Web Content Accessibility Guidelines (WCAG)**).
- Lists use real list markup (`-` or `1.`) instead of manually typed numbers.
- Help and navigation links appear in consistent locations across documentation pages.
- We never convey meaning through position or styling alone (e.g., "see the red text on the right").

### Images, Diagrams, and Videos in Docs

- All images carry meaningful alternative text.
- We use real text instead of images of text, wherever possible.
- Complex images (architecture diagrams, data flow charts) include a bullet-point summary or a short explanation adjacent to the image.
- Demo and tutorial videos provide:
  - **Captions** (human-edited when feasible)
  - **Transcripts** (linked below the video)
  - No auto-playing audio or video
  - Verbal descriptions of important on-screen actions

### Tables

- Tables are used only for tabular data, not for layout.
- Header cells use `<th>` with `scope` attributes (`scope="col"` or `scope="row"`).
- Each table includes a caption or a summary sentence describing its purpose.

### Code Blocks

- Code lines are kept reasonably short (wrapping helps readability on narrow viewports).
- We do not rely on syntax highlighting alone to convey meaning — inline comments explain what the code does and what success looks like.
- Terminal commands include a brief explanation before the code block.

---

## Questions?

If you have questions, feedback, or need assistance using AKMLEVA with assistive technology, reach out:

- **Email:** [luismccampos@gmail.com](mailto:luismccampos@gmail.com)  
- **GitHub:** [open an issue](https://github.com/luismccampos-beep/beta-app/issues/new)  

We aim to respond to accessibility inquiries within **3 business days**.

---

*AKMLEVA is built and maintained by **AKMLEVA Viagens Lda.***
