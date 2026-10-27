// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const fs = require('fs');

// Cloud sandbox ships a stable symlink; honour an env var override for CI / local dev.
const CLOUD_CHROME = '/opt/pw-browsers/chromium';
function chromiumLaunchOptions() {
  const override = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (override) return { executablePath: override };
  if (fs.existsSync(CLOUD_CHROME)) return { executablePath: CLOUD_CHROME };
  return {};
}

module.exports = defineConfig({
  testDir: 'tests',
  testMatch: '**/e2e.spec.js',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'python3 -m http.server 3001 --directory ptaki-przewodnik',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: chromiumLaunchOptions(),
      },
    },
  ],
});
