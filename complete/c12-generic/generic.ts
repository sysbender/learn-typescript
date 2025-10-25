class ArrayOfData<T> {
  constructor(public collection: T[]) {}

  get(index: number): T {
    return this.collection[index];
  }
}

// type inferrence for generics
const arr = new ArrayOfData(["abc", "123"]);

// generic with function

function print<T>(value: T[]): void {
  console.log(value);
}

print(["hello", "world", "!"]);
print([123, 45, 6]);
print([true, false, true]);

// generic constraints

class Car {
  print(): void {
    console.log(" I am a car");
  }
}

class House {
  print(): void {
    console.log(" I am a House");
  }
}

interface Printable {
  print(): void;
}

function printCarOrHouse<T extends Printable>(arr: T[]) {
  for (const obj of arr) {
    obj.print();
  }
}

printCarOrHouse<Car>([new Car(), new Car()]);
