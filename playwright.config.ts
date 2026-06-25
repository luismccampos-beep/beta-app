import { defineConfig, devices } from '@playwright/test';

// Set BASE_URL to test against a deployed environment (e.g. production).
// When BASE_URL is set, the local dev server is NOT started.
// Example: BASE_URL=https://www.akmleva.pt npx playwright test
const isRemote = process.env.BASE_URL !== undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30000,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone SE'] },
    },
  ],
  // Only boot the local dev server when testing locally
  ...(isRemote
    ? {}
    : {
        webServer: {
          command: 'npm run dev',
          url: 'http://localhost:3000',
          reuseExistingServer: !process.env.CI,
          timeout: 60000,
        },
      }),
});
