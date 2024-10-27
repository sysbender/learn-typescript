import { Equal, Expect } from "@total-typescript/helpers";

// question mark before colon to make a parameter optional
const concatName = (first: string, last?: string) => {
  if (!last) {
    return first;
  }
  return `${first} ${last}`;
};

const result = concatName("John", "Doe");
type test = Expect<Equal<typeof result, string>>;

const result2 = concatName("John");
type test2 = Expect<Equal<typeof result2, string>>;
