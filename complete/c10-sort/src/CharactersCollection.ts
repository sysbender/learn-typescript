import { Sorter, type Sortable } from "./Sorter.js";

export class CharactersCollection extends Sorter {
  private data: string;

  // constructor
  constructor(data: string) {
    super();
    this.data = data;
  }

  // getter
  get length(): number {
    return this.data.length;
  }

  // helper
  changeCase(letter: string) {
    if (letter.length === 1) {
      if (letter >= "A" && letter <= "B") {
        return letter.toLowerCase();
      }
      if (letter >= "a" && letter <= "b") {
        return letter.toUpperCase();
      }
    }

    return letter;
  }

  // compare
  compare(leftIndex: number, rightIndex?: number): boolean {
    if (!rightIndex) {
      rightIndex = leftIndex + 1;
    }
    let leftHand = this.changeCase(this.data[leftIndex]!);
    let rightHand = this.changeCase(this.data[rightIndex]!);

    console.log(` compare:  left = ${leftHand} , right=${rightHand}`);
    return leftHand > rightHand;
  }

  // swap
  swap(leftIndex: number, rightIndex?: number): void {
    if (!rightIndex) {
      rightIndex = leftIndex + 1;
    }
    let result = "";
    if (leftIndex > 0) {
      result += this.data.slice(0, leftIndex);
    }
    result += `${this.data[rightIndex]}${this.data[leftIndex]}`;
    if (rightIndex < this.data.length) {
      result += this.data.slice(rightIndex + 1);
    }
    this.data = result;
  }

  //print
  print(): void {
    console.log(` charactersCollection =  ${this.data}`);
  }
}
