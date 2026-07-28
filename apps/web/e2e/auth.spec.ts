import { test, expect } from './fixtures/test-helpers';
import { shouldRunAuthTests } from './fixtures/test-helpers';

test.describe('Authentication Flows', () => {
  test.describe('Auth Page', () => {
    test('loads with login and register tabs', async ({ authPage }) => {
      await authPage.goto();
      
      const loginTab = authPage.locator('button[role="tab"]').filter({ hasText: /Entrar|Login|Sign In/i }).first();
      const registerTab = authPage.locator('button[role="tab"]').filter({ hasText: /Registar|Register|Sign Up/i }).first();
      
      await expect(loginTab).toBeVisible();
      await expect(registerTab).toBeVisible();
    });

    test('login tab is active by default', async ({ authPage }) => {
      await authPage.goto();
      
      const loginTab = authPage.locator('button[role="tab"]').filter({ hasText: /Entrar|Login/i }).first();
      await expect(loginTab).toHaveAttribute('data-state', 'active');
    });

    test('switching to register tab shows registration fields', async ({ authPage }) => {
      await authPage.goto();
      await authPage.switchToRegister();
      
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
    });

    test('login form validation shows errors on empty submit', async ({ authPage }) => {
      await authPage.goto();
      await authPage.loginButton.click();
      
      const toastError = authPage.getPage().locator('[data-sonner-toast]').filter({ hasText: /e-?mail|password|palavra/i });
      await expect(toastError.first()).toBeVisible({ timeout: 10000 });
    });

    test('login with invalid credentials shows error message', async ({ authPage }) => {
      await authPage.goto();
      await authPage.login('test@example.com', 'wrongpassword');
      
      const errorMsg = authPage.getPage().locator('[data-sonner-toast]').filter({ hasText: /Invalid|incorreto|Credenciais/i });
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
    test('register tab shows all required fields', async ({ authPage }) => {
      await authPage.goto();
      await authPage.switchToRegister();
      
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
      await expect(authPage.getPage().locator('[role="checkbox"]').first()).toBeVisible();
    });

    test('register shows error for password too short', async ({ authPage }) => {
      await authPage.goto();
      await authPage.register('newuser@test.com', 'short');
      
      const errorMsg = authPage.getPage().locator('[data-sonner-toast]').filter({ hasText: /8|min|curta|password|palavra/i });
      await expect(errorMsg.first()).toBeVisible({ timeout: 10000 });
    });
  });

  if (shouldRunAuthTests()) {
    test.describe('Authenticated Flows', () => {
      test.beforeEach(async ({ authPage }) => {
        await authPage.goto();
      });

      test('can login with valid credentials', async ({ authPage }) => {
        await authPage.login(
          process.env.E2E_AUTH_TEST_EMAIL!,
          process.env.E2E_AUTH_TEST_PASSWORD!
        );
        await expect(authPage.getPage()).toHaveURL(/\/dashboard/, { timeout: 15000 });
      });

      test('authenticated user can access /dashboard', async ({ authPage }) => {
        await authPage.login(
          process.env.E2E_AUTH_TEST_EMAIL!,
          process.env.E2E_AUTH_TEST_PASSWORD!
        );
        await authPage.getPage().waitForURL(/\/dashboard/, { timeout: 15000 });
        await authPage.getPage().goto('/dashboard');
        await expect(authPage.getPage()).toHaveURL(/\/dashboard/);
        expect(authPage.getPage().url()).toContain('/dashboard');
      });

      test('authenticated user is redirected from /auth to /dashboard', async ({ authPage }) => {
        await authPage.login(
          process.env.E2E_AUTH_TEST_EMAIL!,
          process.env.E2E_AUTH_TEST_PASSWORD!
        );
        await authPage.getPage().waitForURL(/\/dashboard/, { timeout: 15000 });
        await authPage.getPage().goto('/auth');
        await expect(authPage.getPage()).toHaveURL(/\/dashboard/);
      });
    });
  }
});