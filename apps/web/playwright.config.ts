import { e2eEnv } from '@/tests/e2e/env';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/app',
  testMatch: '*.e2e-spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: e2eEnv.E2E_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  webServer: [
    {
      command: 'pnpm --filter @financy/api dev',
      url: `${e2eEnv.NEXT_PUBLIC_API_URL}/health/ready`,
      timeout: 180_000,
      reuseExistingServer: false,
    },
    {
      command: 'pnpm dev --port 3001',
      url: e2eEnv.E2E_BASE_URL,
      wait: {
        stdout: /Ready in/,
      },
      timeout: 180 * 1000,
      reuseExistingServer: false,
    },
  ],
});
