interface RockPaperScissors {
  play(p1move: string, p2move: string): string;
}

export function createRockPaperScissors(): RockPaperScissors {
  return {
    play: function (p1move: string, p2move: string): string {
      return "Player wins";
    },
  };
}
