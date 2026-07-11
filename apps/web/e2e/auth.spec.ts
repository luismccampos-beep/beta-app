import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.describe('Auth Page', () => {
    test('loads with login and register tabs', async ({ page }) => {
      await page.goto('/auth');
      await expect(page.locator('text=/Entrar|Login|Sign In/i').first()).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=/Criar Conta|Register|Sign Up/i').first()).toBeVisible();
    });

    test('login tab is active by default', async ({ page }) => {
      await page.goto('/auth');
      const loginTab = page.locator('button[role="tab"]').filter({ hasText: /Entrar|Login/i }).first();
      await expect(loginTab).toHaveAttribute('data-state', 'active');
    });

    test('switching to register tab shows registration fields', async ({ page }) => {
      await page.goto('/auth');
      const registerTab = page.locator('button[role="tab"]').filter({ hasText: /Criar Conta|Register/i }).first();
      await registerTab.click();
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
    });

    test('login form validation shows errors on empty submit', async ({ page }) => {
      await page.goto('/auth');
      const submitBtn = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Login|Acessar/i }).first();
      await submitBtn.click();
      const toastError = page.locator('[role="status"]').filter({ hasText: /email|password/i });
      await expect(toastError.first()).toBeVisible({ timeout: 5000 });
    });

    test('login with invalid credentials shows error message', async ({ page }) => {
      await page.goto('/auth');
      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      await emailInput.fill('test@example.com');
      await passwordInput.fill('wrongpassword');
      const submitBtn = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Login|Acessar/i }).first();
      await submitBtn.click();
      const errorMsg = page.locator('text=/Invalid|incorreto|Credenciais/i');
      await expect(errorMsg.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Protected Routes', () => {
    test('redirects unauthenticated users from /dashboard to /auth', async ({ page }) => {
      const response = await page.goto('/dashboard', { waitUntil: 'networkidle' });
      const finalUrl = page.url();
      expect(finalUrl).toContain('/auth');
      expect(response?.status()).toBeLessThan(400);
    });

    test('redirects unauthenticated users from /preferences to /auth', async ({ page }) => {
      await page.goto('/preferences', { waitUntil: 'networkidle' });
      const finalUrl = page.url();
      expect(finalUrl).toContain('/auth');
    });
  });

  test.describe('Registration Form', () => {
    test('register tab shows all required fields', async ({ page }) => {
      await page.goto('/auth');
      const registerTab = page.locator('button[role="tab"]').filter({ hasText: /Criar Conta|Register/i }).first();
      await registerTab.click();

      await expect(page.locator('input[type="email"]').first()).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
      await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
    });

    test('register shows error for password too short', async ({ page }) => {
      await page.goto('/auth');
      const registerTab = page.locator('button[role="tab"]').filter({ hasText: /Criar Conta|Register/i }).first();
      await registerTab.click();

      await page.locator('input[type="email"]').first().fill('newuser@test.com');
      const passwordInput = page.locator('input[type="password"]').first();
      await passwordInput.fill('short');
      await page.locator('input[type="checkbox"]').first().check();

      const submitBtn = page.locator('button[type="submit"]').filter({ hasText: /Criar|Register/i }).first();
      await submitBtn.click();

      const errorMsg = page.locator('text=/8|min|curta|captained/i');
      await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
    });
  });

  if (process.env.E2E_AUTH_TEST_EMAIL && process.env.E2E_AUTH_TEST_PASSWORD) {
    test.describe('Authenticated Flows', () => {
      test('can login with valid credentials', async ({ page }) => {
        await page.goto('/auth');
        await page.locator('input[type="email"]').first().fill(process.env.E2E_AUTH_TEST_EMAIL!);
        await page.locator('input[type="password"]').first().fill(process.env.E2E_AUTH_TEST_PASSWORD!);
        const submitBtn = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Login|Acessar/i }).first();
        await submitBtn.click();
        await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
      });

      test('authenticated user can access /dashboard', async ({ page }) => {
        await page.goto('/auth');
        await page.locator('input[type="email"]').first().fill(process.env.E2E_AUTH_TEST_EMAIL!);
        await page.locator('input[type="password"]').first().fill(process.env.E2E_AUTH_TEST_PASSWORD!);
        const submitBtn = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Login|Acessar/i }).first();
        await submitBtn.click();
        await page.waitForURL(/\/dashboard/, { timeout: 15000 });
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/dashboard/);
        expect(page.url()).toContain('/dashboard');
      });

      test('authenticated user is redirected from /auth to /dashboard', async ({ page }) => {
        await page.goto('/auth');
        await page.locator('input[type="email"]').first().fill(process.env.E2E_AUTH_TEST_EMAIL!);
        await page.locator('input[type="password"]').first().fill(process.env.E2E_AUTH_TEST_PASSWORD!);
        const submitBtn = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Login|Acessar/i }).first();
        await submitBtn.click();
        await page.waitForURL(/\/dashboard/, { timeout: 15000 });
        await page.goto('/auth');
        await expect(page).toHaveURL(/\/dashboard/);
      });
    });
  }
});
