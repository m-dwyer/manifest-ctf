const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/base/(.*)$": "<rootDir>/src/base/$1",
    "^@/challenges/(.*)$": "<rootDir>/src/challenges/$1",
    "^@/common/(.*)$": "<rootDir>/src/common/$1",
  },
  setupFiles: [
    "<rootDir>/.jest/setEnvVars.ts",
    "<rootDir>/.jest/setMocks.ts",
    "jest-canvas-mock",
  ],
  collectCoverage: false,
  coverageReporters: ["json", "html"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  runner: "groups",
};

module.exports = createJestConfig(customJestConfig);
