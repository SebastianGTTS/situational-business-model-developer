import { defineConfig } from 'cypress';

export default defineConfig({
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'reports/e2e-report.xml',
  },
  e2e: {
    baseUrl: 'http://localhost:4200',
  },
});
