import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  outputDir: '.local/test-results',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    browserName: 'chromium',
    launchOptions: existsSync(edge) ? { executablePath: edge } : {},
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node scripts/serve.mjs --port 3000',
    url: 'http://127.0.0.1:3000/fr/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
