import { Sorter, type Sortable } from "./Sorter.js";

export class NumbersCollection extends Sorter {
  constructor(public data: number[]) {
    super();
    this.data = data;
  }

  get length(): number {
    return this.data.length;
  }
  // compare
  compare(leftIndex: number, rightIndex: number = leftIndex + 1): boolean {
    console.log(`leftIndex = ${leftIndex} , rightIndex = ${rightIndex}`);

    return this.data[leftIndex]! > this.data[rightIndex]!;
  }
  //swap
  swap(leftIndex: number, rightIndex: number = leftIndex + 1): void {
    if (leftIndex === rightIndex) return; // No-op

    [this.data[leftIndex], this.data[rightIndex]] = [
      this.data[rightIndex]!,
      this.data[leftIndex]!,
    ];

    console.log(`swap ( ${this.data[rightIndex]} ${this.data[leftIndex]})`);
  }

  print(): void {
    console.log(` numbersCollection = ${this.data}`);
  }
}
