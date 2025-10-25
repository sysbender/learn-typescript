import fs from "fs";
import { dateStringToDate } from "..//utils.js";
import type { DataReader } from "./DataReader.js";

export class CsvFileReader implements DataReader {
  data: string[][] = [];
  constructor(public filename: string) {}

  read(): void {
    const text = fs.readFileSync(this.filename, { encoding: "utf8" });
    this.data = text.split("\n").map((line: string) => {
      return line.split(",");
    });
  }
}

/**
 * 

 */
