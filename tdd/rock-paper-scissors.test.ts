import exp from "constants";
import { createRockPaperScissors } from "./rock-paper-scissors";

describe("rock-papaer-scissors", () => {
  test("given player move papaer and opponent move rock should return player wins", () => {
    // Arrange
    const sut = createRockPaperScissors();

    // Action
    const actual = sut.play("Paper", "rock");

    // Assert
    expect(actual).toBe("Player wins");
  });
});
