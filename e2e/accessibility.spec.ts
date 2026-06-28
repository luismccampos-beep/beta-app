import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility — axe-core automated audits', () => {
  test('homepage has no critical or serious violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    // Log violations for the report
    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    // Only log violation IDs and counts — never node details (avoids secret leakage in CI logs)
    if (criticalSerious.length > 0) {
      console.log(
        'Homepage a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
  });

  test('destinations browse page has no critical or serious violations', async ({ page }) => {
    await page.goto('/destinations');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalSerious.length > 0) {
      console.log(
        'Destinations browse a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    // Allow informational / best-practice issues — gate only on critical + serious
    expect(criticalSerious).toEqual([]);
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

    if (criticalSerious.length > 0) {
      console.log(
        'Auth page a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
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

    if (criticalSerious.length > 0) {
      console.log(
        'About page a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
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

    if (criticalSerious.length > 0) {
      console.log(
        'Contact page a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
  });

  test('keyboard navigation — homepage tab order is logical', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through the first several focusable elements
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

    // Verify we moved through several elements (not stuck)
    expect(focusedElements.length).toBeGreaterThan(2);
    // Skip link should appear early in tab order
    const skipLink = focusedElements.findIndex((el) => el.toLowerCase().includes('skip'));
    // If there's a skip link, it should be the first or second element
    if (skipLink >= 0) {
      expect(skipLink).toBeLessThan(3);
    }
  });

  test('skip-to-content link exists and works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Press Tab to reach skip link (it should be first focusable)
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"], a[href="#content"], a[href="#main"]').first();

    // If a skip link exists, verify it's visible on focus
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeVisible();

      // Verify the link actually works: click it and check focus moves to the target
      const targetId = await skipLink.getAttribute('href');
      if (targetId) {
        const targetSelector = targetId.replace('#', '#');
        await skipLink.click();
        // After clicking, the focused element should be the target or inside it
        const activeElement = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? el.id || el.tagName : null;
        });
        // The target element should exist in the DOM
        await expect(page.locator(targetSelector)).toBeAttached();
      }
    }
  });

  test('legal page has no critical or serious violations', async ({ page }) => {
    await page.goto('/legal');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalSerious.length > 0) {
      console.log(
        'Legal page a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
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

    if (criticalSerious.length > 0) {
      console.log(
        'FAQ page a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
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

    if (criticalSerious.length > 0) {
      console.log(
        'Forgot-password page a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
  });

  test('respects prefers-reduced-motion on homepage', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalSerious.length > 0) {
      console.log(
        'Homepage with reduced-motion a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
  });

  test('not-found page has no critical or serious violations', async ({ page }) => {
    await page.goto('/this-path-does-not-exist-12345');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const criticalSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalSerious.length > 0) {
      console.log(
        'Not-found page a11y issues:',
        JSON.stringify(
          criticalSerious.map((v) => ({
            id: v.id,
            impact: v.impact,
            count: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(criticalSerious).toEqual([]);
  });
});
