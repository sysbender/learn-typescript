import { Equal, Expect } from "@total-typescript/helpers";
import { expect, it } from "vitest";

const parsedData: { name: string; age: number } = JSON.parse(
  '{"name": "Alice", "age": 30}'
);

type test = Expect<Equal<typeof parsedData, { name: string; age: number }>>;

it("should be the correct shap", () => {
  expect(parsedData).toEqual({
    name: "Alice",
    age: 30,
  });
});
