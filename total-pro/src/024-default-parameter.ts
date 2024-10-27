import { Equal, Expect } from "@total-typescript/helpers";
import { expect, it } from "vitest";

// optional and default are exclusive
const concatName = (first: string, last = "Doe") => {
  return `${first} ${last}`;
};

it("should return the full name", () => {
  const result = concatName("John", "Doe");

  type test = Expect<Equal<typeof result, string>>;
  expect(result).toEqual("John Doe");
});
