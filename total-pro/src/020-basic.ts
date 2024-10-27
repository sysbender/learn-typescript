import { Expect, Equal } from "@total-typescript/helpers";

const add = (a: number, b: number) => {
  return a + b;
};

const result = add(2, 3);
type test = Expect<Equal<typeof result, number>>;
