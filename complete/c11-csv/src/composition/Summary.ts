import { MatchResults, type MatchData } from "../Match.js";

export interface Analyzer {
  run(mattches: MatchData[]): string;
}

export interface OutputTarget {
  print(report: string): void;
}

export class Summary {
  // analyzer: Analyzer;
  // outputTarget : OutputTarget;
  constructor(
    // public matches: MatchData[],
    public analyzer: Analyzer,
    public outputTarget: OutputTarget
  ) {}

  // staic short cut

  static newConsoleReport(team: string): Summary {
    return new Summary(new WinsAnalysis(team), new ConsoleReport());
  }

  buildAndPrintReport(matches: MatchData[]) {
    const report = this.analyzer.run(matches);
    this.outputTarget.print(report);
  }
}

export class AverageGoalsAnalysis implements Analyzer {
  run(mattches: MatchData[]): string {
    throw new Error("Method not implemented.");
  }
}

export class WinsAnalysis implements Analyzer {
  constructor(public team: string) {}
  run(matches: MatchData[]): string {
    let wins = 0;

    for (const match of matches) {
      if (
        (this.team === match[1] && match[5] === MatchResults.HomeWin) ||
        (this.team === match[2] && match[5] === MatchResults.AwayWin)
      ) {
        wins++;
      }
    }

    return ` ${this.team} won = ${wins} games.`;
  }
}

export class ConsoleReport implements OutputTarget {
  print(report: string): void {
    console.log(report);
  }
}

export class HtmlReport implements OutputTarget {
  print(report: string): void {
    throw new Error("Method not implemented.");
  }
}
