function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(
          `Fail - not equal: actual=${actual}, expected=${expected}`
        );
      }
    },
  };
}

async function test(title, callback) {
  try {
    await callback();
    console.log(` PASS : ${title}`);
  } catch (error) {
    console.error(` FAIL : ${title} `);
    console.error(error);
  }
}

global.test = test;
global.expect = expect;

/**
 * global.test = test and global.expect = expect

This exposes these functions globally, so you don’t need to require them in every test file.

Anywhere in your Node project, you can now call:

test("example", () => { expect(1+1).toBe(2); });

2️⃣ What node --require setup-global.js does

When you run:

node --require setup-global.js my-test-file.js


It means:

Before Node runs my-test-file.js, it first loads setup-global.js.

This sets up the global test and expect functions.

So in your test file, you can use test() and expect() without importing them.

It’s exactly how Jest works internally — Jest sets up globals for you.
 */
