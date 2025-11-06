import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Enable "in-source" testing pattern where test blocks are adjacent to code
    //includeSource: ["src/**/*.{js,ts}"],
    includeSource: ["src/**/*.test.{js,ts}"],
    // Configure environment details if needed (defaults to 'node')
    environment: "node",
  },
});
