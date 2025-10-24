import type { NumbersCollection } from "./NumbersCollection.js";

export interface Sortable {
  length: number;
  compare(leftIndex: number, rightIndex?: number): boolean;
  swap(leftIndex: number, rightIndex?: number): void;
  print(): void;
}
export abstract class Sorter implements Sortable {
  //   private collection: Sortable;
  //   constructor(collection: Sortable) {
  //     // Filter out non-number values safely

  //     this.collection = collection;
  //   }
  abstract length: number;
  abstract compare(leftIndex: number, rightIndex?: number): boolean;
  abstract swap(leftIndex: number, rightIndex?: number): void;
  abstract print(): void;

  sort(): void {
    // const { length } = this.collection;
    // console.log(` start sort , length =${length}`);

    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length - i - 1; j++) {
        // number list

        if (this.compare(j)) {
          this.swap(j);
        }
      }
    }
  }

  //   print(): void {
  //     this.collection.print();
  //   }
}
