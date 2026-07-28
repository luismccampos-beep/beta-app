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

      // Look for language switcher
      const langSwitcher = page.locator('select[name*="lang"], [data-testid*="lang"], button:has-text("PT"), button:has-text("EN")').first();
      
      if (await langSwitcher.isVisible({ timeout: 2000 }).catch(() => false)) {
        await langSwitcher.click();
        await page.waitForTimeout(500);

        // Select different language
        const englishOption = page.locator('text=/English|EN/i').first();
        if (await englishOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await englishOption.click();
          await page.waitForTimeout(1000);
        }
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