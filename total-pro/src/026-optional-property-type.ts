import { Expect, Equal } from "@total-typescript/helpers";
import { expect, it } from "vitest";

type User = {
  first: string;
  last?: string;
};
const concatName = (user: User) => {
  if (!user.last) {
    return user.first;
  }
  return `${user.first} ${user.last}`;
};

it("should return the full name", () => {
  const result = concatName({
    first: "John",
    last: "Doe",
  });
  type test = Expect<Equal<typeof result, string>>;

  expect(result).toEqual("John Doe");
});

it("should return the full name when missing last", () => {
  const result = concatName({
    first: "John",
  });
  type test = Expect<Equal<typeof result, string>>;
  expect(result).toEqual("John");
});
