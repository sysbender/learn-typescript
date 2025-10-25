import fs from "fs";

// import type { MatchData } from "./MatchReader.js";

export abstract class CsvFileReader<T> {
  data: T[] = [];
  constructor(public filename: string) {}
  abstract mapRow(row: string[]): T;

  read(): void {
    const text = fs.readFileSync(this.filename, { encoding: "utf8" });
    this.data = text
      .split("\n")
      .map((line: string) => {
        return line.split(",");
      })
      .map(this.mapRow);
  }
}
