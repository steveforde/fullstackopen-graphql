const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // 🌟 This forces Playwright to spin up your real app directories cleanly from scratch!
  webServer: [
    {
      command: "cd ../library-backend && NODE_ENV=test npm run dev",
      port: 4000,
      timeout: 60000,
      reuseExistingServer: false,
    },
    {
      command: "cd ../library-frontend && npm run dev",
      port: 5173,
      timeout: 60000,
      reuseExistingServer: false,
    },
  ],
});
