import type { MatchData, MatchResults } from "../Match.js";
import { dateStringToDate } from "../utils.js";
import type { DataReader } from "./DataReader.js";

export class MatchReader {
  //   reader: DataReader;

  constructor(public reader: DataReader) {}
  matches: MatchData[] = [];

  load(): void {
    console.log("===================== load in match reader");
    // load file to data
    this.reader.read();
    // save to
    this.matches = this.reader.data.map((value: string[], index: number) => {
      let newValue: MatchData = [
        dateStringToDate(value[0]!),
        value[1]!,
        value[2]!,
        parseInt(value[3]!),
        parseInt(value[4]!),
        value[5] as MatchResults, // type assertion
        value[6]!,
      ];

      return newValue;
    });
  }
}
