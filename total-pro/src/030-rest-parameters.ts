import { Equal, Expect } from "@total-typescript/helpers";
import { expect, it } from "vitest";

export function concatnate(...strings: string[]) {
  return strings.join("");
}

it("should concatenate strings", () => {
  const result = concatnate("hello", " ", "world");

  type result = Expect<Equal<typeof result, string>>;
  expect(result).toEqual("hello world");
});
