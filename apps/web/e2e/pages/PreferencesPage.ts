import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PreferencesPage extends BasePage {
  readonly stepIndicator: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly skipButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.stepIndicator = page.locator('[aria-current="step"]');
    this.nextButton = page.locator('button:visible').filter({ hasText: /Próxima Etapa|Next Step/i }).first();
    this.previousButton = page.locator('button:visible').filter({ hasText: /← Anterior|← Previous|← Voltar/i }).first();
    this.skipButton = page.locator('button:visible').filter({ hasText: /Saltar|Skip/i }).first();
    this.submitButton = page.locator('button[type="submit"]:visible').filter({ hasText: /Ver as minhas viagens|See my trips|Guardar|Save|Enviar|Submit/i }).first();
  }

  async goto() {
    await super.goto('/preferences/edit');
  }

  async goToStep2() {
    await this.nextButton.scrollIntoViewIfNeeded();
    await this.nextButton.click();
    await this.waitForBudgetChips();
  }

  async goToStep3() {
    await this.goToStep2();
    const budgetChip = this.page.locator('button:visible').filter({ hasText: /Conforto|Comfort/i }).first();
    await budgetChip.click();
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

  async waitForStep(stepNumber: number) {
    await this.stepIndicator.first().waitFor({ state: 'visible', timeout: 10000 });
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