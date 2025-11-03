import { test, expect, vi } from "vitest";
import { greeting } from "./greeting.js";

test("greeting", () => {
  const spy = vi.spyOn(console, "log");

  greeting("world");

  expect(spy).toBeCalledWith("Hello , world");
  expect(spy).toBeCalledTimes(1);

  spy.mockReset(); //reset times
  greeting("there");
  expect(spy).toBeCalledWith("Hello , there");
  expect(spy).toBeCalledTimes(1);

  // snapshot
  expect(spy).toMatchInlineSnapshot(`
    [MockFunction log] {
      "calls": [
        [
          "Hello , there",
        ],
      ],
      "results": [
        {
          "type": "return",
          "value": undefined,
        },
      ],
    }
  `);
});
