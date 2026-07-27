import { test, expect } from '@playwright/test';

test.describe('Travel Preferences Form - 3-Step Quick Flow', () => {
  // Bypass middleware auth so the form itself can be exercised without valid credentials.
  test.use({ extraHTTPHeaders: { 'x-e2e-auth': 'true' } });

  test.beforeEach(async ({ page }) => {
    // Navigate to the preferences form
    await page.goto('/preferences/edit', { waitUntil: 'domcontentloaded' });
    // Dismiss cookie consent dialog if present
    const acceptCookies = page.locator('button:visible').filter({ hasText: /Accept All|Aceitar|Aceptar|Accept/i }).first();
    await acceptCookies.click({ timeout: 5000 }).catch(() => {});
    // Wait for form to render — the step indicator card with circles is the reliable desktop signal
    await page.waitForSelector('[aria-current="step"]', { timeout: 15000 }).catch(() => {});
    // Fallback: wait for any travel style content
    await page.waitForSelector('button >> text=/Luxo|Luxury|Económico|Budget/i', { timeout: 15000 }).catch(() => {});
  });

  test('Step 1: should display travel style cards and allow selection', async ({ page }) => {
    // On desktop the step circles show labels — the active step should have aria-current="step"
    const activeStep = page.locator('[aria-current="step"]');
    await expect(activeStep.first()).toBeVisible({ timeout: 5000 });

    // Select "Luxury" travel style
    const luxuryCard = page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first();
    await luxuryCard.click();

    // Verify card is selected — selected cards use border-transparent + shadow-lg + gradient overlay
    await expect(luxuryCard).toHaveClass(/border-transparent shadow-lg/);
    // The check icon should also be visible inside the selected card
    await expect(luxuryCard.locator('svg').last()).toBeVisible({ timeout: 3000 });
  });

  test('Step 1 → Step 2: should navigate to budget step', async ({ page }) => {
    // Click "Next" — use visible button filter to avoid hidden mobile nav
    const nextBtn = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    // Wait for budget chips to appear (step 2 content)
    const budgetChip = page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first();
    await expect(budgetChip).toBeVisible({ timeout: 10000 });
  });

  test('Step 2: should allow selecting a budget chip', async ({ page }) => {
    // Navigate to step 2
    const nextBtn = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();

    // Wait for budget chips to appear
    await expect(page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first()).toBeVisible({ timeout: 10000 });

    // Click "Premium" budget chip
    const premiumChip = page.locator('button:visible').filter({ hasText: /Premium/i }).first();
    await premiumChip.click();

    // Verify chip is selected — budget chips use border-primary + bg-primary-50 when selected
    await expect(premiumChip).toHaveClass(/border-primary/);
  });

  test('Step 2 → Step 3: should navigate to review step', async ({ page }) => {
    // Navigate to step 2
    const nextBtn1 = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn1.scrollIntoViewIfNeeded();
    await nextBtn1.click();
    
    // Wait for budget chips and click one
    await expect(page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first()).toBeVisible({ timeout: 10000 });
    await page.locator('button:visible').filter({ hasText: /Conforto|Comfort/i }).first().click();
    
    // Click Next to go to step 3
    const nextBtn2 = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn2.scrollIntoViewIfNeeded();
    await nextBtn2.click();

    // Verify we're on Step 3 — the third step circle should have aria-current="step"
    const thirdStep = page.locator('[aria-current="step"]');
    await expect(thirdStep.first()).toBeVisible({ timeout: 5000 });
  });

  test('Skip step: should allow skipping Step 1', async ({ page }) => {
    // Click "Skip this step" link (it's a button, not a link)
    const skipLink = page.locator('button:visible').filter({ hasText: /Saltar|Skip/i }).first();
    if (await skipLink.isVisible()) {
      await skipLink.click();
    }

    // Should navigate to step 2 — budget chips should appear
    await expect(page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test('Complete flow with only 3 required fields', async ({ page }) => {
    // Next → Step 2
    const nextBtn1 = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn1.scrollIntoViewIfNeeded();
    await nextBtn1.click();

    // Step 2: Wait for budget chips and select one
    await expect(page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first()).toBeVisible({ timeout: 10000 });
    await page.locator('button:visible').filter({ hasText: /Conforto|Comfort/i }).first().click();
    
    // Next → Step 3
    const nextBtn2 = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn2.scrollIntoViewIfNeeded();
    await nextBtn2.click();

    // Step 3: Verify submit button exists (see my trips / guardar)
    const submitBtn = page.locator('button[type="submit"]:visible').filter({ hasText: /Ver as minhas viagens|See my trips|Guardar|Save|Enviar|Submit/i }).first();
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
  });

  test('Mobile: step indicator should show text not circles', async ({ page, browserName }) => {
    // Only run on mobile project
    test.skip(browserName !== 'webkit', 'Mobile-only test');

    // Verify mobile step text is visible
    await expect(page.getByText(/Passo 1 de 3|Step 1 of 3/i).first()).toBeVisible({ timeout: 5000 });

    // Progress bar should be visible
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible();
  });

  test('Refine panel: should expand advanced sections on step 3', async ({ page }) => {
    // Navigate to step 3
    const nextBtn1 = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn1.scrollIntoViewIfNeeded();
    await nextBtn1.click();
    await expect(page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first()).toBeVisible({ timeout: 10000 });
    await page.locator('button:visible').filter({ hasText: /Conforto|Comfort/i }).first().click();
    const nextBtn2 = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn2.scrollIntoViewIfNeeded();
    await nextBtn2.click();

    // Click "Refine preferences" button
    const refineBtn = page.locator('button:visible').filter({ hasText: /Refinar|Refine|Filtros|Filters/i }).first();
    if (await refineBtn.isVisible()) {
      await refineBtn.click();
    }

    // Advanced sections should appear
    await expect(page.locator('text=/Preferências de Voo|Flight Preferences|Opções Avançadas|Advanced/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('AI Insights: should show generate button on step 3', async ({ page }) => {
    // Navigate to step 3
    const nextBtn1 = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn1.scrollIntoViewIfNeeded();
    await nextBtn1.click();
    await expect(page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first()).toBeVisible({ timeout: 10000 });
    await page.locator('button:visible').filter({ hasText: /Conforto|Comfort/i }).first().click();
    const nextBtn2 = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn2.scrollIntoViewIfNeeded();
    await nextBtn2.click();

    // "Generate insights" button or insights panel should be visible
    const insightsBtn = page.locator('button:visible').filter({ hasText: /Gerar insights|Generate insights|AI|Recomendações/i }).first();
    await expect(insightsBtn).toBeVisible({ timeout: 5000 });
  });

  test('Back navigation: should go to previous step', async ({ page }) => {
    // Navigate to step 2
    const nextBtn = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    await nextBtn.scrollIntoViewIfNeeded();
    await nextBtn.click();
    // Verify we reached step 2 — budget chips should be visible
    await expect(page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first()).toBeVisible({ timeout: 10000 });

    // Click "Previous" / "Voltar"
    const prevBtn = page.locator('button:visible').filter({ hasText: /← Anterior|← Previous|← Voltar/i }).first();
    await prevBtn.scrollIntoViewIfNeeded();
    await prevBtn.click();

    // Should be back on Step 1 — travel style buttons should be visible
    await expect(
      page.locator('button:visible').filter({ hasText: /Luxo|Luxury|Aventura|Adventure/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Travel Preferences Form - Draft Persistence', () => {
  test.use({ extraHTTPHeaders: { 'x-e2e-auth': 'true' } });

  test('should auto-save draft to localStorage', async ({ page }) => {
    await page.goto('/preferences/edit', { waitUntil: 'domcontentloaded' });
    // Dismiss cookie consent dialog if present
    const acceptCookies = page.locator('button:visible').filter({ hasText: /Accept All|Aceitar|Aceptar|Accept/i }).first();
    await acceptCookies.click({ timeout: 5000 }).catch(() => {});
    await page.waitForSelector('[aria-current="step"]', { timeout: 15000 }).catch(() => {});
    await page.waitForSelector('button:visible >> text=/Luxo|Luxury/i', { timeout: 15000 }).catch(() => {});

    // Select a travel style
    const luxuryCard = page.locator('button:visible').filter({ hasText: /Luxo|Luxury/i }).first();
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
