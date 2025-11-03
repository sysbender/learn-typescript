import { test, expect, vi } from "vitest";

import { loadConfig } from "./loadConfig.js";

// (path to the module, factory function to create )
vi.mock("fs", () => {
  return {
    readFileSync() {
      return '{"name": "mocked"}';
    },
  };
});

test("with fs", async () => {
  const result = loadConfig();
  expect(result).toEqual({ name: "mocked" });
});
