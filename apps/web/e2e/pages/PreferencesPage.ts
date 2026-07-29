import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PreferencesPage extends BasePage {
  readonly stepIndicator: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly skipButton: Locator;
  readonly submitButton: Locator;

  /** Desktop step indicator (circles with aria-current="step", hidden below md breakpoint) */
  readonly desktopStepIndicator: Locator;
  /** Mobile step indicator (progress bar, hidden at md and above) */
  readonly mobileStepIndicator: Locator;

  constructor(page: Page) {
    super(page);
    this.desktopStepIndicator = page.locator('[aria-current="step"]');
    this.mobileStepIndicator = page.locator('[role="progressbar"]');
    this.stepIndicator = this.desktopStepIndicator;
    this.nextButton = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    this.previousButton = page.locator('button:visible').filter({ hasText: /← Anterior|← Previous|← Voltar/i }).first();
    this.skipButton = page.locator('button:visible').filter({ hasText: /Saltar|Skip/i }).first();
    this.submitButton = page.locator('button[type="submit"]:visible').filter({ hasText: /Ver as minhas viagens|See my trips|Guardar|Save|Enviar|Submit/i }).first();
  }

  async goto() {
    // Bypass auth redirect for protected /preferences route (middleware checks this header)
    await this.page.setExtraHTTPHeaders({ 'x-e2e-auth': 'true' });
    await super.goto('/preferences/edit');
  }

  async goToStep2() {
    await this.nextButton.scrollIntoViewIfNeeded();
    await this.nextButton.click();
    await this.waitForBudgetChips();
  }

  async goToStep3() {
    // Assumes caller already navigated to step 1 (budget) and selected a budget.
    // Advances from step 1 to step 2 (review). Do NOT re-call goToStep2() here
    // because callers (e.g. preferences-form.spec.ts) already call goToStep2() first.
    await this.nextButton.scrollIntoViewIfNeeded();
    await this.nextButton.click();
    await this.waitForStep(3);
  }

  async selectTravelStyle(style: 'luxury' | 'budget' | 'adventure' | 'comfort') {
    const styleMap: Record<string, RegExp> = {
      luxury: /Luxo|Luxury/i,
      budget: /Económico|Budget/i,
      adventure: /Aventura|Adventure/i,
      comfort: /Conforto|Comfort/i,
    };

    const card = this.page.locator('button').filter({ hasText: styleMap[style] }).first();
    await card.click();
    await this.waitForElement(card);
  }

  async selectBudget(budget: 'economical' | 'comfort' | 'premium' | 'luxury') {
    const budgetMap: Record<string, RegExp> = {
      economical: /Económico|Economical/i,
      comfort: /Conforto|Comfort/i,
      premium: /Premium/i,
      luxury: /Luxo|Luxury/i,
    };

    const chip = this.page.locator('button:visible').filter({ hasText: budgetMap[budget] }).first();
    await chip.click();
    await this.waitForElement(chip);
  }

  async skipStep() {
    if (await this.skipButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.skipButton.click();
    }
  }

  async goBack() {
    await this.previousButton.scrollIntoViewIfNeeded();
    await this.previousButton.click();
  }

  async waitForStep(_stepNumber: number) {
    // Ensure the page is fully loaded before checking step indicators.
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
      // Fall through to domcontentloaded if networkidle times out (e.g. long-polling)
      return this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    });

    // On desktop (≥768px), step circles with aria-current="step" are visible.
    // On mobile (<768px), a progress bar [role="progressbar"] is shown instead.
    // Wait for whichever indicator is visible in the current viewport.
    // Use Promise.any() (not race) — waits for first fulfillment,
    // so a hidden desktop indicator on mobile won't cause a rejection.
    await Promise.any([
      this.desktopStepIndicator.first().waitFor({ state: 'visible', timeout: 15000 }),
      this.mobileStepIndicator.first().waitFor({ state: 'visible', timeout: 15000 }),
    ]);
  }

  async waitForBudgetChips() {
    await this.page
      .locator('button:visible')
      .filter({ hasText: /Económico|Conforto|Premium|Luxo/i })
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  async getCurrentStep(): Promise<number> {
    const steps = await this.stepIndicator.all();
    return steps.length;
  }

  async isOnStep(stepNumber: number): Promise<boolean> {
    const currentStep = await this.getCurrentStep();
    return currentStep === stepNumber;
  }

  async submitForm() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  async expandRefinePanel() {
    const refineBtn = this.page.locator('button:visible').filter({ hasText: /Refinar|Refine|Filtros|Filters/i }).first();
    if (await refineBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await refineBtn.click();
    }
  }

  async getInsightsButton(): Promise<Locator | null> {
    const insightsBtn = this.page.locator('button:visible').filter({ hasText: /Gerar insights|Generate insights|AI|Recomendações/i }).first();
    if (await insightsBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      return insightsBtn;
    }
    return null;
  }
}