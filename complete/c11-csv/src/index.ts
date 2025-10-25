import { MatchReader } from "./composition/MatchReader.js";
import { CsvFileReader } from "./composition/CsvFileReader.js";
import { MatchResults, type MatchData } from "./Match.js";

//------------
import { Summary, WinsAnalysis, ConsoleReport } from "./composition/Summary.js";

// const csvFileReader = new CsvFileReader('./football.csv');

const csvReader = new CsvFileReader(
  "F:/workspace/learn-typescript/complete/c11-csv/football.csv"
);
// csvReader.read();

const matchReader = new MatchReader(csvReader);
matchReader.load();

const manWins = (data: MatchData[]) => {
  let wins = 0;

  data.forEach((fields) => {
    // console.log(fields);
    if (
      (fields[1] === "Man United" && fields[5] === MatchResults.HomeWin) ||
      (fields[2] === "Man United" && fields[5] === MatchResults.AwayWin)
    ) {
      wins++;
    }
  });

  console.log(`Man United , wins = ${wins}`);
};

manWins(matchReader.matches);

//=======================

const summary = new Summary(
  new WinsAnalysis("Man United"),
  new ConsoleReport()
);

console.log("summary =======aaa");
summary.buildAndPrintReport(matchReader.matches);

// static method for composite shortcut
Summary.newConsoleReport("Liverpool").buildAndPrintReport(matchReader.matches);
