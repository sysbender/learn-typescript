import { Sorter, type Sortable } from "./Sorter.js";

class Node {
  next: Node | null = null;

  constructor(public value: number) {}
  toString(): string {
    return `${this.value}`;
  }
}

export class LinkedList extends Sorter {
  head: Node | null = null;

  //   constructor(head?: Node) {
  //     super();
  //     if (head) {
  //       this.head = head;
  //     }
  //   }
  compare(leftIndex: number, rightIndex?: number): boolean {
    if (!this.head || !this.head.next) {
      throw new Error("Need at least two node to compare");
    }
    if (!rightIndex) {
      rightIndex = leftIndex + 1;
    }

    if (rightIndex < this.length) {
      return this.at(leftIndex)!.value > this.at(rightIndex)!.value;
    }

    return false;
  }
  swap(leftIndex: number, rightIndex?: number): void {
    if (!rightIndex) {
      rightIndex = leftIndex + 1;
    }

    let nodes: (Node | null)[] = [null, null, null, null];

    if (leftIndex > 0) {
      nodes[0] = this.at(leftIndex - 1);
    }
    nodes[1] = this.at(leftIndex);
    nodes[2] = nodes[1].next;

    if (rightIndex < this.length - 1) {
      nodes[3] = nodes[2]!.next;
    }

    if (nodes[0]) {
      nodes[0].next = nodes[2];
    } else {
      this.head = nodes[2];
    }

    nodes[2]!.next = nodes[1];

    if (nodes[3]) {
      nodes[1].next = nodes[3];
    } else {
      nodes[1]!.next = null;
    }

    // if (rightIndex < this.length) {
    //   const leftNode = this.head!.next;
    //   if (leftIndex === 0) {
    //     this.head!.next = this.at(rightIndex);
    //   }
    // }
  }
  print(): void {
    let result: number[] = [];
    let tail = this.head;
    while (tail) {
      result.push(tail.value);
      tail = tail.next;
    }
    console.log(`  nodelist = ${result}`);
  }

  // add
  add(value: number): void {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      return;
    }

    let tail = this.head;
    while (tail.next) {
      // find tail that next === null
      tail = tail.next;
    }
    tail.next = node;
  }

  // at
  at(index: number): Node {
    let count = 0;
    let tail = this.head;
    while (tail) {
      if (count === index) {
        return tail;
      }
      tail = tail.next;
      count += 1;
    }
    throw new Error("out of range of linkedlist");
  }

  //----------
  get length(): number {
    let result = 0;

    let tail = this.head;
    while (tail) {
      result += 1;
      tail = tail.next;
    }

    return result;
  }
}
