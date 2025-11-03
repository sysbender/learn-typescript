import { test, expect } from "vitest";
import { deepMerge } from "./deepMerge.js";
const obj1 = {
  server: {
    port: 3000,
    host: "localhost",
  },
};

const obj2 = {
  server: { port: 4000 },
  build: {
    dir: "build",
  },
};

const obj3 = {
  server: {
    port: 4000,
    host: "localhost",
  },
  build: {
    dir: "build",
  },
};

test("shallow merge", () => {
  const merged = deepMerge({ name: "John" }, { age: 30 });

  expect(merged).toEqual({ name: "John", age: 30 });
});

test("overlap merge", () => {
  const merged = deepMerge({ name: "Jane" }, { name: "John", age: 30 });

  expect(merged).toEqual({ name: "John", age: 30 });
});

test("array merge", () => {
  const merged = deepMerge([1, 2], [3, 4]);

  expect(merged).toEqual([1, 2, 3, 4]);
});

test("deep merge", () => {
  const merged = deepMerge(
    { name: "John", accounts: { outlook: "john@outlook.com" } },
    { accounts: { gmail: "john@gmail.com" }, age: 30 }
  );

  expect(merged).toEqual({
    name: "John",
    age: 30,
    accounts: { outlook: "john@outlook.com", gmail: "john@gmail.com" },
  });
});

test("throw error on merging two different types", () => {
  const merged = deepMerge(["a"], { foo: "bar" });
  console.log(merged);
});

test.fails("throw error and fail", () => {
  throw new Error("NewError");
});

function throwError() {
  throw new Error("NewError");
}
test("throw error and pass", () => {
  expect(() => throwError()).toThrowError("NewError"); // throw in functon
});

// snapshot

test("snapshot deep merge ", () => {
  const merged = deepMerge(
    { name: "John", accounts: { outlook: "john@outlook.com" } },
    { accounts: { gmail: "john@gmail.com" }, age: 30 }
  );

  // expect(merged).toEqual({
  //   name: "John",
  //   age: 30,
  //   accounts: { outlook: "john@outlook.com", gmail: "john@gmail.com" },
  // });

  expect(merged).toMatchSnapshot();
  expect(merged).toMatchInlineSnapshot(`
    {
      "accounts": {
        "gmail": "john@gmail.com",
        "outlook": "john@outlook.com",
      },
      "age": 30,
      "name": "John",
    }
  `);
});
