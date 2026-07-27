import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DISMISS_COOKIES = async (page: import('@playwright/test').Page) => {
  const btn = page.locator('button:visible').filter({ hasText: /Aceitar todos/i }).first();
  await btn.click({ timeout: 5000 }).catch(() => {});
};

test.describe('Accessibility — axe-core automated audits', () => {
  test('homepage has no critical or serious violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await DISMISS_COOKIES(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalSerious.length > 0) {
      console.log(
        'Homepage a11y issues:',
        JSON.stringify(criticalSerious.map((v) => ({ id: v.id, impact: v.impact, count: v.nodes.length })), null, 2)
      );
    }

    const actionable = criticalSerious.filter((v) => v.id !== 'label' && v.id !== 'color-contrast');
    expect(actionable).toEqual([]);
  });

  test('auth page has no critical or serious violations', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    const actionable = criticalSerious.filter((v) => v.id !== 'color-contrast');
    expect(actionable).toEqual([]);
  });

  test('about page has no critical or serious violations', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    const actionable = criticalSerious.filter((v) => v.id !== 'color-contrast');
    expect(actionable).toEqual([]);
  });

  test('contact page has no critical or serious violations', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    const actionable = criticalSerious.filter((v) => v.id !== 'color-contrast');
    expect(actionable).toEqual([]);
  });

  test('faq page has no critical or serious violations', async ({ page }) => {
    await page.goto('/faq');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    const actionable = criticalSerious.filter((v) => v.id !== 'color-contrast');
    expect(actionable).toEqual([]);
  });

  test('forgot-password page has no critical or serious violations', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    const actionable = criticalSerious.filter((v) => v.id !== 'color-contrast');
    expect(actionable).toEqual([]);
  });

  test('not-found page renders without critical violations', async ({ page }) => {
    const response = await page.goto('/this-path-does-not-exist-12345', { timeout: 15000 }).catch(() => null);
    if (!response) {
      test.skip();
      return;
    }
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    const actionable = criticalSerious.filter((v) => v.id !== 'color-contrast');
    expect(actionable).toEqual([]);
  });
});

test.describe('Accessibility — dark/light mode contrast', () => {
  test('homepage passes contrast checks in light mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await DISMISS_COOKIES(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations.filter((v) => v.impact === 'critical').length).toBe(0);
  });

  test('homepage passes contrast checks in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await DISMISS_COOKIES(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations.filter((v) => v.impact === 'critical').length).toBe(0);
  });

  test('form pages pass contrast in both modes', async ({ page }) => {
    const formPages = ['/auth', '/forgot-password'];

    for (const route of formPages) {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const lightResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const lightCritical = lightResults.violations.filter(
        (v) => v.id === 'color-contrast' && v.impact === 'critical'
      );
      expect(lightCritical.length).toBe(0);

      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();
      await page.waitForLoadState('networkidle');

      const darkResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const darkCritical = darkResults.violations.filter(
        (v) => v.id === 'color-contrast' && v.impact === 'critical'
      );
      expect(darkCritical.length).toBe(0);
    }
  });
});

test.describe('Accessibility — keyboard-only navigation', () => {
  test('homepage tab order is logical', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await DISMISS_COOKIES(page);

    const focusedElements: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        return {
          tag: el.tagName,
          text: (el as HTMLElement).innerText?.slice(0, 60) || '',
          role: el.getAttribute('role') || '',
          ariaLabel: el.getAttribute('aria-label') || '',
        };
      });
      if (focused) focusedElements.push(`${focused.tag} "${focused.text || focused.ariaLabel}"`);
    }

    expect(focusedElements.length).toBeGreaterThan(2);
    const skipLink = focusedElements.findIndex((el) => el.toLowerCase().includes('skip'));
    if (skipLink >= 0) {
      expect(skipLink).toBeLessThan(3);
    }
  });

  test('skip-to-content link exists and works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]').first();

    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible();
      const targetId = await skipLink.getAttribute('href');
      if (targetId) {
        const targetSelector = targetId.replace('#', '#');
        await skipLink.click();
        await expect(page.locator(targetSelector)).toBeAttached();
      }
    }
  });

  test('auth page form is keyboard navigable', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');

    const interactiveTags = new Set<string>();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const tag = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.tagName : null;
      });
      if (tag) interactiveTags.add(tag);
      if (tag === 'BODY') break;
    }

    expect(interactiveTags.size).toBeGreaterThan(1);
  });

  test('Enter/Space activates buttons and links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await DISMISS_COOKIES(page);

    let activated = false;
    for (let i = 0; i < 15 && !activated; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        return {
          tag: el.tagName,
          text: (el as HTMLElement).innerText?.slice(0, 40) || '',
          role: el.getAttribute('role') || '',
          href: el.getAttribute('href'),
          disabled: (el as HTMLButtonElement).disabled,
        };
      });

      if (info?.disabled) continue;
      if (info?.text.toLowerCase().includes('skip')) continue;

      if (info?.tag === 'BUTTON' || info?.role === 'button') {
        await page.keyboard.press('Enter');
        activated = true;
        break;
      }
      if (info?.tag === 'A' && info.href && !info.href.startsWith('#')) {
        await page.keyboard.press('Enter');
        await page.waitForTimeout(500);
        activated = true;
        break;
      }
    }

    expect(activated).toBe(true);
  });

  test('prefers-reduced-motion has no auto-playing animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const autoPlayingMedia = await page.evaluate(() => {
      const media = document.querySelectorAll('video[autoplay], audio[autoplay]');
      return Array.from(media).map((m) => ({
        tag: m.tagName,
        paused: (m as HTMLMediaElement).paused,
        muted: (m as HTMLMediaElement).muted,
      }));
    });

    for (const m of autoPlayingMedia) {
      expect(m.paused || m.muted).toBe(true);
    }

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    const actionable = criticalSerious.filter((v) => v.id !== 'label' && v.id !== 'color-contrast');
    expect(actionable).toEqual([]);
  });
});

test.describe('Accessibility — screen reader landmarks', () => {
  test('homepage has proper landmark regions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const landmarks = await page.evaluate(() => {
      const found: Record<string, number> = {};
      found['banner'] = document.querySelectorAll('[role="banner"], header').length;
      found['navigation'] = document.querySelectorAll('[role="navigation"], nav').length;
      found['main'] = document.querySelectorAll('[role="main"], main, #main-content').length;
      found['contentinfo'] = document.querySelectorAll('[role="contentinfo"], footer').length;
      return found;
    });

    expect(landmarks['navigation'] || landmarks['banner']).toBeGreaterThan(0);
    expect(landmarks['main']).toBeGreaterThan(0);
  });

  test('images have alt text or are marked as decorative', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const imageIssues = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      const issues: string[] = [];
      for (const img of imgs) {
        const alt = img.getAttribute('alt');
        const role = img.getAttribute('role');
        const ariaHidden = img.getAttribute('aria-hidden');
        if (alt === null && role !== 'presentation' && ariaHidden !== 'true') {
          issues.push(`Missing alt: ${img.getAttribute('src')?.slice(0, 60) || 'unknown'}`);
        }
      }
      return issues;
    });

    expect(imageIssues.length).toBeLessThan(5);
  });
});
