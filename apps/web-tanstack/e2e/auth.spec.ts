import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page renders with email and password fields', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('#auth-email')).toBeVisible();
    await expect(page.locator('#auth-password')).toBeVisible();
    await expect(page.locator('button[type="submit"]').filter({ hasText: /Entrar/i })).toBeVisible();
  });

  test('login page has correct heading', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('h1')).toHaveText('Entrar');
  });

  test('login page has forgot password link', async ({ page }) => {
    await page.goto('/auth');
    const forgotLink = page.locator('a[href="/forgot-password"]');
    await expect(forgotLink).toBeVisible();
    await expect(forgotLink).toHaveText(/Esqueceu-se da palavra-passe/i);
  });

  test('login page has register prompt', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('text=/Criar Conta/i')).toBeVisible();
  });

  test('forgot-password page renders correctly', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.locator('h1')).toHaveText('Esqueceu-se da palavra-passe?');
    await expect(page.locator('#forgot-email')).toBeVisible();
    await expect(page.locator('button[type="submit"]').filter({ hasText: /Enviar/i })).toBeVisible();
  });

  test('forgot-password has back to login link', async ({ page }) => {
    await page.goto('/forgot-password');
    const backLink = page.locator('a[href="/auth"]');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveText(/Voltar ao início de sessão/i);
  });

  test('login form has proper labels', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('label[for="auth-email"]')).toHaveText('E-mail');
    await expect(page.locator('label[for="auth-password"]')).toHaveText('Palavra-passe');
  });
});

test.describe('Protected Routes', () => {
  test('redirects unauthenticated users from /dashboard to /auth', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/auth/);
  });

  test('redirects unauthenticated users from /preferences to /auth', async ({ page }) => {
    await page.goto('/preferences', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/auth/);
  });

  test('redirects unauthenticated users from /preferences/edit to /auth', async ({ page }) => {
    await page.goto('/preferences/edit', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/auth/);
  });
});
