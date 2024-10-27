import { Equal, Expect } from "@total-typescript/helpers";

const concatTTwoStrings = (a: string, b: string) => {
  return [a, b].join(" ");
};

// TEST
const result = concatTTwoStrings("hello", "world");
type test = Expect<Equal<typeof result, string>>;
