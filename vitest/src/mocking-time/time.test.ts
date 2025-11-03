import { test, expect, vi } from "vitest";

function getCurrentTime() {
  return new Date().toTimeString().slice(0, 5);
}

test("time", () => {
  vi.setSystemTime(new Date("20000-1-1 14:13"));
  expect(getCurrentTime()).toBe("14:13");
});
