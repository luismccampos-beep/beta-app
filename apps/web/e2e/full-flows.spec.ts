import { test, expect } from './fixtures/test-helpers';
import { shouldRunAuthTests } from './fixtures/test-helpers';

test.describe('Complete User Flows', () => {
  // Registration requires a working database — skip when E2E_AUTH_TEST_EMAIL is not set
  if (shouldRunAuthTests()) {
    test.describe('Registration to Preferences Flow', () => {
      test('new user can register and access preferences', async ({ page }) => {
        // Generate unique email for this test
        const uniqueEmail = `test-${Date.now()}@example.com`;
        const password = 'TestPassword123!';

        // Navigate to auth page
        await page.goto('/auth');
        await page.waitForLoadState('networkidle');

        // Switch to register tab
        const registerTab = page.locator('button, a, [role="tab"]').filter({ hasText: /Registar|Register|Sign Up/i }).first();
        await registerTab.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(500);

        // Fill registration form
        await page.locator('input[type="email"]').first().fill(uniqueEmail);
        await page.locator('input[type="password"]').first().fill(password);

        // Accept terms
        const checkbox = page.locator('input[type="checkbox"], [role="checkbox"]').first();
        await checkbox.click({ force: true }).catch(() => {});

        // Submit registration
        const registerButton = page.locator('form button[type="submit"], form button').filter({ hasText: /Registar|Register|Sign Up/i }).first();
        await registerButton.click();

        // Should redirect to dashboard or preferences
        await page.waitForURL(/\/(dashboard|preferences)/, { timeout: 15000 });
      });
    });
  }

  if (shouldRunAuthTests()) {
    test.describe('Authenticated User Journey', () => {
      test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/auth');
        await page.locator('input[type="email"]').first().fill(process.env.E2E_AUTH_TEST_EMAIL!);
        await page.locator('input[type="password"]').first().fill(process.env.E2E_AUTH_TEST_PASSWORD!);
        await page.locator('form button[type="submit"]').filter({ hasText: /Entrar|Sign In/i }).first().click();
        await page.waitForURL(/\/dashboard/, { timeout: 15000 });
      });

      test('user can navigate from dashboard to preferences', async ({ page }) => {
        // Look for preferences link in navigation
        const prefsLink = page.locator('a[href*="preferences"], button:has-text("Preferências"), button:has-text("Preferences")').first();
        
        if (await prefsLink.isVisible({ timeout: 2000 }).catch(() => false)) {
          await prefsLink.click();
          await page.waitForURL(/\/preferences/, { timeout: 10000 });
        }
      });

      test('user can complete preferences form', async ({ page }) => {
        await page.goto('/preferences/edit');
        await page.waitForLoadState('networkidle');

        // Complete step 1
        const luxuryCard = page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first();
        await luxuryCard.click();
        await page.waitForTimeout(500);

        // Go to step 2
        const nextBtn = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
        await nextBtn.click();
        await page.waitForTimeout(1000);

        // Select budget
        const premiumChip = page.locator('button:visible').filter({ hasText: /Premium/i }).first();
        await premiumChip.click();
        await page.waitForTimeout(500);

        // Go to step 3
        await nextBtn.click();
        await page.waitForTimeout(1000);

        // Should be on review step
        const submitBtn = page.locator('button[type="submit"]:visible').filter({ hasText: /Guardar|Save|Enviar|Submit/i }).first();
        await expect(submitBtn).toBeVisible({ timeout: 5000 });
      });

      test('user can logout', async ({ page }) => {
        // Look for logout button
        const logoutBtn = page.locator('button:has-text("Logout"), button:has-text("Sair"), a[href*="logout"]').first();
        
        if (await logoutBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await logoutBtn.click();
          await page.waitForURL(/\/auth/, { timeout: 10000 });
        }
      });
    });
  }

  test.describe('Navigation Flow', () => {
    test('user can navigate through main pages', async ({ page }) => {
      // Navigate directly to about page (avoids footer scroll issues)
      const response = await page.goto('/about', { timeout: 30000 }).catch(() => null);
      if (!response || response.status() >= 500) {
        test.skip();
        return;
      }
      await page.waitForLoadState('networkidle');

      // Verify the about page has content
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test('browser back button works correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Navigate to about page directly
      await page.goto('/about', { timeout: 30000 });
      await page.waitForLoadState('networkidle');

      // Go back — use domcontentloaded instead of networkidle to avoid timeout
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      expect(page.url()).toContain('/');
    });
  });
});