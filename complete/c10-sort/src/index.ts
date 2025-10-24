import { CharactersCollection } from "./CharactersCollection.js";
import { LinkedList } from "./LinkedList.js";
import { NumbersCollection } from "./NumbersCollection.js";
import { Sorter } from "./Sorter.js";

const nc = new NumbersCollection([2, 1, 3, -4]);

nc.sort();

console.log(`len = ${nc.length}`);

const cc = new CharactersCollection("1aBa2");

cc.sort();
cc.print();

console.log(` ${"a" > "B"}`);

const n = new LinkedList();
n.add(1234);
n.add(456);
n.add(123);
n.add(789);

let node = n.at(2);
console.log(node?.toString());
console.log(n.compare(1, 2));
n.sort();
n.print();
