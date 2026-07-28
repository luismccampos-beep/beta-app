import { test as base, type Page, type Response, type ConsoleMessage } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { HomePage } from '../pages/HomePage';
import { PreferencesPage } from '../pages/PreferencesPage';

type TestFixtures = {
  authPage: AuthPage;
  homePage: HomePage;
  preferencesPage: PreferencesPage;
};

export const test = base.extend<TestFixtures>({
  authPage: async ({ page }, setupFixture) => {
    const authPage = new AuthPage(page);
    await setupFixture(authPage);
  },

  homePage: async ({ page }, setupFixture) => {
    const homePage = new HomePage(page);
    await setupFixture(homePage);
  },

  preferencesPage: async ({ page }, setupFixture) => {
    const preferencesPage = new PreferencesPage(page);
    await setupFixture(preferencesPage);
  },
});

export { expect } from '@playwright/test';

// Helper functions
export const TEST_USERS = {
  valid: {
    email: process.env.E2E_AUTH_TEST_EMAIL || 'test@example.com',
    password: process.env.E2E_AUTH_TEST_PASSWORD || 'testpassword123',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

export const TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000,
  veryLong: 60000,
};

export const PAGES = {
  home: '/',
  auth: '/auth',
  dashboard: '/dashboard',
  preferences: '/preferences/edit',
  destinations: '/destinations',
  about: '/about',
  contact: '/contact',
  legal: '/legal',
  faq: '/faq',
  forgotPassword: '/forgot-password',
};

// Helper to check if we're in CI environment
export const isCI = () => process.env.CI !== undefined;

// Helper to check if authenticated tests should run
export const shouldRunAuthTests = () => {
  return process.env.E2E_AUTH_TEST_EMAIL && process.env.E2E_AUTH_TEST_PASSWORD;
};

// Helper to wait for API response
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 10000
) {
  return page.waitForResponse(
    (response: Response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
}

// Helper to check for console errors
export function setupConsoleErrorTracking(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

// Helper to check for failed network requests
export function setupNetworkFailureTracking(page: Page) {
  const failedRequests: string[] = [];
  page.on('response', (response: Response) => {
    if (response.status() >= 400 && response.url().includes('/_next/')) {
      failedRequests.push(`${response.status()} ${response.url()}`);
    }
  });
  return failedRequests;
}