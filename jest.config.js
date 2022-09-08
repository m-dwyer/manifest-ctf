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
  setupFiles: ["<rootDir>/.jest/setEnvVars.ts"],
};

module.exports = createJestConfig(customJestConfig);
