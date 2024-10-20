import exp from "constants";
import { greeter } from "./greeter";

describe("greeter", () => {
  test("helloWorld given default should return `Hello world!`", () => {
    const sut = greeter(); // system under test
    const actual = sut.helloWorld();
    const expected = "Hello world!";
    expect(actual).toBe(expected);
  });
});
