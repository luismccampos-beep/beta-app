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
  workers: isRemote ? 4 : undefined, // Auto-detect in local, fixed in CI
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  timeout: 30000, // Reduced from 60s to catch performance issues
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30000, // Reduced from 60s
    actionTimeout: 10000,
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
          url: 'http://localhost:3001',
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
          env: {
            DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/akmleva',
            DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED || 'postgresql://postgres:postgres@localhost:5433/akmleva',
            AUTH_SECRET: process.env.AUTH_SECRET || 'test-secret-for-e2e',
            BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || 'e7c94b2a8f6d1e0c3b5a9d7f2e4c6a8b1d3f5e7c9a2b4d6f8e0c1a3b5d7f9e2c',
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
            INTERNAL_API_KEY: process.env.INTERNAL_API_KEY || 'test-internal-api-key',
            // Leave Upstash env vars empty so the app disables rate-limiting gracefully
            // instead of pointing Redis at the Next.js dev server.
            UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || '',
            UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',
          },
        },
      }),
});