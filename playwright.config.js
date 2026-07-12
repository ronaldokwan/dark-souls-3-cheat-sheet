import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:8137',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node tests/server.mjs',
    url: 'http://127.0.0.1:8137/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
