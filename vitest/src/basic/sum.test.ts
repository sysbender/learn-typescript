import { test, expect } from "vitest";

function sum(...nums: number[]): number {
  return nums.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
}

test(" add", () => {
  expect(sum(1, 2)).toEqual(3);
  //   expect(sum(1, 2, 3)).toEqual(6));
});

test(" add", () => {
  expect(sum(1, 2, 3)).toEqual(6);
  expect(sum()).toEqual(0);
});
