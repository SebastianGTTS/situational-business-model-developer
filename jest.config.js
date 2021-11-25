module.exports = {
  // angular specific
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  testMatch: ['<rootDir>/src/**/*.spec.ts'],

  // coverage
  coverageDirectory: 'coverage',
  coverageReporters: ['cobertura', 'html', 'text'],
};
