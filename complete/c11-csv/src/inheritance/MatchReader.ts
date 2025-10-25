import { CsvFileReader } from "./CsvFileReader.js";
import { dateStringToDate } from "../utils.js";
import type { MatchData, MatchResults } from "../Match.js";

export class MatchReader extends CsvFileReader<MatchData> {
  mapRow(row: string[]): MatchData {
    let newValue: MatchData = [
      dateStringToDate(row[0]!),
      row[1]!,
      row[2]!,
      parseInt(row[3]!),
      parseInt(row[4]!),
      row[5] as MatchResults, // type assertion
      row[6]!,
    ];
    return newValue;
  }
}
