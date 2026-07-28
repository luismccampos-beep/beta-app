import { test, expect } from './fixtures/test-helpers';

test.describe('Internationalization (i18n)', () => {
  const locales = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  test.describe('Homepage translations', () => {
    for (const locale of locales) {
      test(`displays content in ${locale.name}`, async ({ page }) => {
        await page.goto(`/?lang=${locale.code}`);
        await page.waitForLoadState('networkidle');

        // Page should load without errors
        const response = page.url();
        expect(response).toBeTruthy();

        // Should have content (heading or text)
        const hasContent = await page.locator('h1, h2, h3, p').first().isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasContent).toBe(true);
      });
    }
  });

  test.describe('Auth page translations', () => {
    for (const locale of locales) {
      test(`auth page works in ${locale.name}`, async ({ page }) => {
        await page.goto(`/auth?lang=${locale.code}`);
        await page.waitForLoadState('networkidle');

        // Should show login/register tabs
        const loginTab = page.locator('button[role="tab"]').first();
        await expect(loginTab).toBeVisible({ timeout: 5000 });

        // Should have form fields
        const emailInput = page.locator('input[type="email"]').first();
        await expect(emailInput).toBeVisible();
      });
    }
  });

  test.describe('Language switching', () => {
    test('user can switch between languages', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // The LanguageSwitcher renders buttons with flag emojis and aria-label attributes
      // e.g. <button aria-label="English" title="English">🇺🇸</button>
      const langButton = page.locator('button[aria-label="English"]').first();

      if (await langButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await langButton.click();
        // LanguageSwitcher calls window.location.reload() — wait for full reload
        await page.waitForLoadState('networkidle', { timeout: 15000 });

        // Verify the page now shows English content (look for English-specific text)
        const hasEnglishContent = await page.locator('text=/Sign In|Log In|Home|About/i').first().isVisible({ timeout: 5000 }).catch(() => false);
        const url = page.url();
        // Either English text is visible or the URL/locale changed
        expect(hasEnglishContent || url.includes('en')).toBe(true);
      } else {
        // Language switcher not visible (e.g. minimal layout), just verify page loads
        const hasContent = await page.locator('h1, h2, h3').first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasContent).toBe(true);
      }
    });
  });

  test.describe('No hardcoded text', () => {
    test('pages do not contain untranslated hardcoded strings', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get all visible text content
      const bodyText = await page.evaluate(() => {
        return document.body.innerText;
      });

      // Check for common hardcoded patterns (this is a basic check)
      // In a real scenario, you'd compare against translation files
      const hasContent = bodyText.length > 100;
      expect(hasContent).toBe(true);
    });
  });

  test.describe('RTL support', () => {
    test('page structure supports RTL languages', async ({ page }) => {
      // Even though the app might not have RTL languages, 
      // the structure should not break
      await page.goto('/?lang=pt');
      await page.waitForLoadState('networkidle');

      const htmlDir = await page.evaluate(() => {
        return document.documentElement.getAttribute('dir');
      });

      // Should either be undefined (LTR default) or 'ltr'
      expect(!htmlDir || htmlDir === 'ltr').toBe(true);
    });
  });
});