import { Page, Locator } from '@playwright/test';

export class BasePage {
  constructor(public page: Page) {}

  getPage(): Page {
    return this.page;
  }

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async goto(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async dismissCookieConsent() {
    const acceptCookies = this.page
      .locator('button:visible')
      .filter({ hasText: /Accept All|Aceitar|Aceptar|Accept/i })
      .first();
    await acceptCookies.click({ timeout: 5000 }).catch(() => {});
  }

  getVisibleButton(text: RegExp | string): Locator {
    return this.page.locator('button:visible').filter({ hasText: text }).first();
  }

  getVisibleLink(text: RegExp | string): Locator {
    return this.page.locator('a:visible').filter({ hasText: text }).first();
  }

  async waitForElement(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }
}
