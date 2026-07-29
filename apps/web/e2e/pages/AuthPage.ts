import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerTab: Locator;
  readonly loginTab: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[type="email"]').first();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.loginButton = page.locator('form button[type="submit"]').filter({ hasText: /Entrar|Sign In|Login/i }).first();
    this.registerTab = page.locator('button[role="tab"]').filter({ hasText: /Registar|Register|Sign Up/i }).first();
    this.loginTab = page.locator('button[role="tab"]').filter({ hasText: /Entrar|Login|Sign In/i }).first();
  }

  async goto() {
    await super.goto('/auth');
  }

  async switchToRegister() {
    await this.registerTab.click();
    await this.page.waitForTimeout(500);
  }

  async switchToLogin() {
    await this.loginTab.click();
    await this.page.waitForTimeout(500);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    // Wait for the auth API response before returning so callers don't race
    // against a toast that hasn't appeared yet (especially on slower Mobile Safari).
    const responsePromise = this.page.waitForResponse(
      (r) => r.url().includes('/api/auth') && r.request().method() === 'POST',
      { timeout: 15000 }
    ).catch(() => null); // don't throw if the form uses a different endpoint
    await this.loginButton.click();
    await responsePromise;
  }

  async register(email: string, password: string, acceptTerms = true) {
    await this.switchToRegister();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    
    if (acceptTerms) {
      const checkbox = this.page.locator('[role="checkbox"]').first();
      await checkbox.click({ force: true });
    }

    const registerButton = this.page.locator('form button[type="submit"]').filter({ hasText: /Registar|Register|Sign Up/i }).first();
    await registerButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    const toastError = this.page.locator('[data-sonner-toast]').first();
    if (await toastError.isVisible({ timeout: 5000 }).catch(() => false)) {
      return await toastError.textContent();
    }
    return null;
  }

  async isOnAuthPage(): Promise<boolean> {
    return this.page.url().includes('/auth');
  }

  async isOnDashboard(): Promise<boolean> {
    return this.page.url().includes('/dashboard');
  }
}