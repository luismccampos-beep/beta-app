import { test, expect } from '@playwright/test';

test.describe('Travel Preferences Form - 3-Step Quick Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the preferences form
    await page.goto('/preferences/edit');
    // Wait for form to render
    await page.waitForSelector('text=Estilo de Viagem', { timeout: 10000 }).catch(() => {});
    await page.waitForSelector('text=Travel Style', { timeout: 10000 }).catch(() => {});
  });

  test('Step 1: should display travel style cards and allow selection', async ({ page }) => {
    // Verify step indicator shows Step 1
    const stepText = page.locator('text=/Passo 1|Etapa 1|Step 1/i');
    await expect(stepText.first()).toBeVisible({ timeout: 5000 });

    // Select "Luxury" travel style
    const luxuryCard = page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first();
    await luxuryCard.click();

    // Verify card is selected (should have teal/gradient background)
    await expect(luxuryCard).toHaveClass(/border-transparent|bg-teal/);
  });

  test('Step 1 → Step 2: should navigate to budget step', async ({ page }) => {
    // Select a travel style first
    const luxuryCard = page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first();
    await luxuryCard.click();

    // Click "Next" or "Seguinte"
    const nextBtn = page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first();
    await nextBtn.click();

    // Verify we're on Step 2 (budget)
    await expect(page.locator('text=/Passo 2|Etapa 2|Step 2/i').first()).toBeVisible({ timeout: 5000 });
    
    // Verify budget chips are visible
    await expect(page.locator('text=/Económico|Budget|Conforto|Comfort/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('Step 2: should allow selecting a budget chip', async ({ page }) => {
    // Navigate to step 2
    const luxuryCard = page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first();
    await luxuryCard.click();
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();

    // Click "Premium" budget chip
    const premiumChip = page.locator('button').filter({ hasText: /Premium/i }).first();
    await premiumChip.click();

    // Verify chip is selected (teal border)
    await expect(premiumChip).toHaveClass(/border-teal/);
  });

  test('Step 2 → Step 3: should navigate to review step', async ({ page }) => {
    // Navigate to step 2
    await page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first().click();
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();
    
    // Click a budget chip
    await page.locator('button').filter({ hasText: /Conforto|Comfort/i }).first().click();
    
    // Click Next
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();

    // Verify we're on Step 3 (review)
    await expect(page.locator('text=/Passo 3|Etapa 3|Step 3/i').first()).toBeVisible({ timeout: 5000 });

    // "See my trips" button should be visible
    const ctaBtn = page.locator('button').filter({ hasText: /Ver as minhas viagens|See my trips/i }).first();
    await expect(ctaBtn).toBeVisible({ timeout: 5000 });
  });

  test('Skip step: should allow skipping Step 1', async ({ page }) => {
    // Click "Skip this step" link
    const skipLink = page.locator('button').filter({ hasText: /Saltar|Skip/i }).first();
    if (await skipLink.isVisible()) {
      await skipLink.click();
    }

    // Should navigate to step 2
    await expect(page.locator('text=/Passo 2|Etapa 2|Step 2/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('Complete flow with only 3 required fields', async ({ page }) => {
    // Step 1: Select travel style + destination
    await page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first().click();
    
    // Wait for catalog to load before selecting destination
    const destTrigger = page.locator('button').filter({ hasText: /Procurar destinos|Search destinations/i }).first();
    await expect(destTrigger).toBeVisible({ timeout: 10000 });
    await destTrigger.click();
    
    // Select first available destination by its label text (more semantic than cmdk-item)
    const firstDest = page.locator('[role="option"]').first();
    if (await firstDest.isVisible({ timeout: 3000 })) {
      await firstDest.click();
    }
    await page.keyboard.press('Escape');

    // Next → Step 2
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();

    // Step 2: Select budget chip
    await page.locator('button').filter({ hasText: /Conforto|Comfort/i }).first().click();
    
    // Next → Step 3
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();

    // Step 3: Verify submit button exists
    const submitBtn = page.locator('button').filter({ hasText: /Ver as minhas viagens|See my trips/i }).first();
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
    await expect(submitBtn).toBeEnabled();
  });

  test('Mobile: step indicator should show text not circles', async ({ page, browserName }) => {
    // Only run on mobile project
    test.skip(browserName !== 'webkit', 'Mobile-only test');

    // Verify mobile step text is visible
    await expect(page.locator('text=/Passo 1 de 3|Step 1 of 3/i').first()).toBeVisible({ timeout: 5000 });

    // Progress bar should be visible
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible();
  });

  test('Refine panel: should expand advanced sections on step 3', async ({ page }) => {
    // Navigate to step 3
    await page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first().click();
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();
    await page.locator('button').filter({ hasText: /Conforto|Comfort/i }).first().click();
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();

    // Click "Refine preferences" button
    const refineBtn = page.locator('button').filter({ hasText: /Refinar|Refine|Filtros|Filters/i }).first();
    if (await refineBtn.isVisible()) {
      await refineBtn.click();
    }

    // Advanced sections should appear
    await expect(page.locator('text=/Preferências de Voo|Flight Preferences/i').first()).toBeVisible({ timeout: 3000 });
  });

  test('AI Insights: should show generate button on step 3', async ({ page }) => {
    // Navigate to step 3
    await page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first().click();
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();
    await page.locator('button').filter({ hasText: /Conforto|Comfort/i }).first().click();
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();

    // "Generate insights" button should be visible
    const insightsBtn = page.locator('button').filter({ hasText: /Gerar insights|Generate insights/i }).first();
    await expect(insightsBtn).toBeVisible({ timeout: 5000 });
  });

  test('Back navigation: should go to previous step', async ({ page }) => {
    // Navigate to step 2
    await page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first().click();
    await page.locator('button').filter({ hasText: /Próxima|Next|Seguinte/i }).first().click();

    // Click "Previous" / "Voltar"
    const prevBtn = page.locator('button').filter({ hasText: /Anterior|Previous|Voltar/i }).first();
    await prevBtn.click();

    // Should be back on Step 1
    await expect(page.locator('text=/Passo 1|Etapa 1|Step 1/i').first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Travel Preferences Form - Draft Persistence', () => {
  test('should auto-save draft to localStorage', async ({ page }) => {
    await page.goto('/preferences/edit');
    await page.waitForTimeout(2000);

    // Select a travel style
    const luxuryCard = page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first();
    await luxuryCard.click();

    // Wait for debounced save (1s localStorage)
    await page.waitForTimeout(1500);

    // Check localStorage has draft
    const hasDraft = await page.evaluate(() => {
      return localStorage.getItem('travel_prefs_draft') !== null;
    });
    expect(hasDraft).toBe(true);
  });
});
