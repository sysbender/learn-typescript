import { Equal, Expect } from "@total-typescript/helpers";
// tuple of two number

const setRange = (range: [x: number, y: number]) => {
  const x = range[0];
  const y = range[1];

  // do something with x and y

  // x and y should be numbers
  type tests = [
    Expect<Equal<typeof x, number>>,
    Expect<Equal<typeof y, number>>,
  ];
};

setRange([0, 10]);

// setRange([0, "10"]);

// setRange([0]);

// setRange([0, 10, 20]);
