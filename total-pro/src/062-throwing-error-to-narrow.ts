import { Equal, Expect } from "@total-typescript/helpers";

const appElement = document.getElementById("app");
if (!appElement) {
  throw new Error("app Not exist");
}

type test = Expect<Equal<typeof appElement, HTMLElement>>;
