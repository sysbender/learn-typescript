const { sum, subtract, subtractAsync } = require("../math");
/**
Factory Function	When creating and returning objects without class
Fluent Interface	When designing chainable, readable APIs (like expect().toBe())
Closure-based Object	When methods need to “remember” values from their parent scope
 */

let result, expected;

// Test sum
sumTest = () => {
  const result = sum(3, 7);
  const expected = 10;
  expect(result).toBe(expected);
};

// Test subtract

subtractTest = async () => {
  const result = await subtractAsync(7, 3);
  const expected = 4;
  expect(result).toBe(expected);
};

test(" sum adds numbers", sumTest);
test("subtract - subtracts numbers", subtractTest);
