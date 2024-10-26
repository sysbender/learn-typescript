import exp from "constants";
import { greeter } from "./greeter";

describe("greeter", () => {
  test("helloWorld given default should return `Hello world!`", () => {
    // Arrange - state, service, sut
    const sut = greeter(); // system under test
    const expected = "Hello world!";

    // Act
    const actual = sut.helloWorld();

    //Assert
    expect(actual).toBe(expected);
  });
});
