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
  webServer: [
    {
      command: "npm run start:backend",
      port: 4000,
      timeout: 60000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run start:frontend",
      port: 5173,
      timeout: 60000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
