import { test, expect } from '@playwright/test';

test.describe('Production Health Check', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
  });

  test('homepage has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AKMLEVA/);
  });

  test('homepage renders main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 });
  });

  test('auth page loads successfully', async ({ page }) => {
    const response = await page.goto('/auth');
    expect(response?.status()).toBeLessThan(400);
  });

  test('about page loads successfully', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBeLessThan(400);
  });

  test('destinations page loads successfully', async ({ page }) => {
    const response = await page.goto('/destinations');
    expect(response?.status()).toBeLessThan(400);
  });

  test('faq page loads successfully', async ({ page }) => {
    const response = await page.goto('/faq');
    expect(response?.status()).toBeLessThan(400);
  });

  test('contact page loads successfully', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBeLessThan(400);
  });

  test('forgot-password page loads successfully', async ({ page }) => {
    const response = await page.goto('/forgot-password');
    expect(response?.status()).toBeLessThan(400);
  });

  test('legal pages load successfully', async ({ page }) => {
    const legalRoutes = ['/legal/terms', '/legal/privacy', '/legal/gdpr'];
    for (const route of legalRoutes) {
      const response = await page.goto(route);
      expect(response?.status()).toBeLessThan(400);
    }
  });

  test('homepage loads within 30 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(30_000);
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const footerLinks = page.locator('footer a');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(2);
  });

  test('mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toBeVisible();
  });
});
