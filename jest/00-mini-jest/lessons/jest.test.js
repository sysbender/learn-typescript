const { sumAsync, subtractAsync } = require("../math");

test("sumAsync adds numbers asynchronosly", async () => {
  const result = await sumAsync(3, 7);
  const expected = 10;
  expect(result).toBe(expected);
});
