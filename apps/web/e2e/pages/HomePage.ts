import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly navigationLinks: Locator;
  readonly cookieConsentButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1, h2').filter({ hasText: /viagem|travel|descubra/i }).first();
    this.navigationLinks = page.locator('a[href]');
    this.cookieConsentButton = page.locator('button:visible').filter({ hasText: /Accept All|Aceitar|Aceptar|Accept/i }).first();
  }

  async goto() {
    await super.goto('/');
  }

  async acceptCookies() {
    await this.cookieConsentButton.click({ timeout: 5000 }).catch(() => {});
  }

  async getHeadingText(): Promise<string | null> {
    if (await this.heading.isVisible({ timeout: 5000 }).catch(() => false)) {
      return await this.heading.textContent();
    }
    return null;
  }

  async getNavigationLinksCount(): Promise<number> {
    return await this.navigationLinks.count();
  }

  async clickNavigationLink(text: RegExp | string) {
    const link = this.getVisibleLink(text);
    await link.click();
  }
}