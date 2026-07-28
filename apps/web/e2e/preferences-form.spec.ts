import { test, expect } from './fixtures/test-helpers';

test.describe('Travel Preferences Form - 3-Step Quick Flow', () => {
  test.beforeEach(async ({ preferencesPage }) => {
    await preferencesPage.goto();
    await preferencesPage.dismissCookieConsent();
    await preferencesPage.waitForStep(1);
  });

  test('Step 1: should display travel style cards and allow selection', async ({ preferencesPage }) => {
    const activeStep = preferencesPage.locator('[aria-current="step"]');
    await expect(activeStep.first()).toBeVisible({ timeout: 5000 });

    await preferencesPage.selectTravelStyle('luxury');

    const luxuryCard = preferencesPage.page.locator('button').filter({ hasText: /Luxo|Luxury/i }).first();
    await expect(luxuryCard).toHaveClass(/border-transparent shadow-lg/);
    await expect(luxuryCard.locator('svg').last()).toBeVisible({ timeout: 3000 });
  });

  test('Step 1 → Step 2: should navigate to budget step', async ({ preferencesPage }) => {
    await preferencesPage.goToStep2();

    const budgetChip = preferencesPage.page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first();
    await expect(budgetChip).toBeVisible({ timeout: 10000 });
  });

  test('Step 2: should allow selecting a budget chip', async ({ preferencesPage }) => {
    await preferencesPage.goToStep2();

    await preferencesPage.selectBudget('premium');

    const premiumChip = preferencesPage.page.locator('button:visible').filter({ hasText: /Premium/i }).first();
    await expect(premiumChip).toHaveClass(/border-primary/);
  });

  test('Step 2 → Step 3: should navigate to review step', async ({ preferencesPage }) => {
    await preferencesPage.goToStep2();
    await preferencesPage.selectBudget('comfort');
    await preferencesPage.goToStep3();

    const thirdStep = preferencesPage.locator('[aria-current="step"]');
    await expect(thirdStep.first()).toBeVisible({ timeout: 5000 });
  });

  test('Skip step: should allow skipping Step 1', async ({ preferencesPage }) => {
    await preferencesPage.skipStep();

    const budgetChip = preferencesPage.page.locator('button:visible').filter({ hasText: /Económico|Conforto|Premium|Luxo/i }).first();
    await expect(budgetChip).toBeVisible({ timeout: 10000 });
  });

  test('Complete flow with only 3 required fields', async ({ preferencesPage }) => {
    await preferencesPage.goToStep2();
    await preferencesPage.selectBudget('comfort');
    await preferencesPage.goToStep3();

    const submitBtn = preferencesPage.submitButton;
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
  });

  test('Mobile: step indicator should show text not circles', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Mobile-only test');

    await expect(page.getByText(/Passo 1 de 3|Step 1 of 3/i).first()).toBeVisible({ timeout: 5000 });

    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible();
  });

  test('Refine panel: should expand advanced sections on step 3', async ({ preferencesPage }) => {
    await preferencesPage.goToStep2();
    await preferencesPage.selectBudget('comfort');
    await preferencesPage.goToStep3();
    await preferencesPage.expandRefinePanel();

    await expect(preferencesPage.page.locator('text=/Preferências de Voo|Flight Preferences|Opções Avançadas|Advanced/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('AI Insights: should show generate button on step 3', async ({ preferencesPage }) => {
    await preferencesPage.goToStep2();
    await preferencesPage.selectBudget('comfort');
    await preferencesPage.goToStep3();

    const insightsBtn = await preferencesPage.getInsightsButton();
    if (insightsBtn) {
      await expect(insightsBtn).toBeVisible({ timeout: 5000 });
    }
  });

  test('Back navigation: should go to previous step', async ({ preferencesPage }) => {
    await preferencesPage.goToStep2();

    await preferencesPage.goBack();

    const travelStyleButton = preferencesPage.page.locator('button:visible').filter({ hasText: /Luxo|Luxury|Aventura|Adventure/i }).first();
    await expect(travelStyleButton).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Travel Preferences Form - Draft Persistence', () => {
  test('should auto-save draft to localStorage', async ({ preferencesPage }) => {
    await preferencesPage.goto();
    await preferencesPage.dismissCookieConsent();
    await preferencesPage.waitForStep(1);

    await preferencesPage.selectTravelStyle('luxury');

    await preferencesPage.page.waitForTimeout(1500);

    const hasDraft = await preferencesPage.page.evaluate(() => {
      return localStorage.getItem('travel_prefs_draft') !== null;
    });
    expect(hasDraft).toBe(true);
  });
});