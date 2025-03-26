/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "jest-playwright-preset",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  setupFilesAfterEnv: ["dotenv/config"]
};