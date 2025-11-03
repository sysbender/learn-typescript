import { log } from "console";
import { test, expect, vi, beforeEach } from "vitest";

function warnLater(message: string) {
  setTimeout(() => {
    console.log(message);
  }, 2_000);
}

beforeEach(() => {
  vi.useFakeTimers();
});

test("warnLater", async () => {
  const logSpy = vi.spyOn(console, "log");
  warnLater("2 seconds passed");

  expect(logSpy).to.not.toBeCalled();

  //await new Promise((resolve) => setTimeout(resolve, 2_000));

  vi.advanceTimersByTime(1999);
  expect(logSpy).to.not.toBeCalled();
  vi.advanceTimersByTime(1);
  expect(logSpy).to.toBeCalledWith("2 seconds passed");
});
