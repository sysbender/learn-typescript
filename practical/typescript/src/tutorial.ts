console.log("------------start worksheet--------");
type Events = {
  add: string;
  remove: string;
  move: string;
};

type EventKeys = keyof Events;

type onEvents = {
  // onAdd: () => any;
  // onRemove: () => any;

  [key in EventKeys as `on${Capitalize<key>}`]: () => any;
};
const userActions: onEvents = {
  onAdd: () => {
    console.log("on add...");
  },
  onRemove: () => {
    console.log("on remove...");
  },
  onMove: () => {},
};

//=========template

type RgbCss = `rgb(${number},${number},${number})`;
const validRgb: RgbCss = "rgb(1,2,3)";
///const invalidRgb: RgbCss = "rgb(1,2)";

// type RgbCss = `rgb(${number},${number},${number})`;

// const validRgb: RgbCss = "rgb(1,2,3)"; // This works fine.
// const invalidRgb: RgbCss = "rgb(1,2)"; // This will result in a TypeScript error.

type BooleanOrNever<T> = T extends boolean ? boolean : never;
type Test = BooleanOrNever<string>;
//    ^?

type NoEmptyString<T> = T extends "" ? never : T;
function failOnEmptyString<T extends string>(input: NoEmptyString<T>) {
  if (!input.length) {
    throw new Error("input is empty");
  } else {
    console.log(`input = ${input}`);
  }
}

failOnEmptyString("hello");
// run time safety - satisfy

type fruits = "apple" | "banada" | "cherry";
function getFruitInitial(fruit: fruits): string {
  switch (fruit) {
    case "apple":
      return "a";
    case "banada":
      return "b";
    case "cherry":
      return "c";
    default:
      // return "";
      throw new Error(` ${fruit satisfies never} is not known `);
  }
}

const init = getFruitInitial("apple");

// inference
function add(a: number, b: number): number {
  return a + b;
}
type addReturn = FuncReturn<typeof add>;
//    ^?
type FuncReturn<T> = T extends (...args: any[]) => infer R ? R : never;
