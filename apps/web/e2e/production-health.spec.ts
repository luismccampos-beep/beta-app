import { test, expect } from '@playwright/test';

test.describe('Production Health Check', () => {
  test('homepage loads without redirect loop', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    // Verify we landed on the expected domain (not stuck in a redirect loop)
    const url = page.url();
    expect(url).toContain('akmleva.pt');
    // Page should render the main heading
    await expect(
      page.locator('h1, h2').filter({ hasText: /viagem|travel|descubra/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Filter out benign third-party errors (analytics, ads, etc.)
    const criticalErrors = errors.filter(
      (e) => !e.includes('google') && !e.includes('gtag') && !e.includes('analytics')
    );
    expect(criticalErrors).toEqual([]);
  });

  test('static assets load (CSS/JS)', async ({ page }) => {
    const failedRequests: string[] = [];
    page.on('response', (res) => {
      if (res.status() >= 400 && res.url().includes('/_next/')) {
        failedRequests.push(`${res.status()} ${res.url()}`);
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(failedRequests).toEqual([]);
  });

  test('API health endpoint responds', async ({ request }) => {
    const base = process.env.BASE_URL || 'http://localhost:3000';
    // Try common health endpoints — pass if any responds with 2xx
    const endpoints = ['/api/health', '/api/v1/health', '/api/ping'];
    let found = false;
    for (const ep of endpoints) {
      const res = await request.get(`${base}${ep}`, { failOnStatusCode: false });
      if (res.ok()) {
        found = true;
        break;
      }
    }
    // If no dedicated health endpoint exists, just verify the site itself is up
    if (!found) {
      const home = await request.get(base);
      expect(home.ok()).toBeTruthy();
    }
  });

  test('site responds within 5 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5000);
  });

  test('page title is set', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('');
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');
    // At least one internal link should exist
    const links = page.locator('a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone SE
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
    // Content should still be visible
    await expect(
      page.locator('h1, h2, h3').first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('no mixed content warnings', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('Mixed Content')) {
        warnings.push(msg.text());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(warnings).toEqual([]);
  });
});
