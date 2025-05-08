export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['./**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  rootDir: '.',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  reporters: [
    'default',
    [
      'jest-ctrf-json-reporter',
      { outputDir: 'reports', outputFile: 'unit.report.json' },
    ],
  ],
};