import { test, expect, ContextRPC } from "vitest";

// ===== let and const inference type - are different

namespace V155 {
  type ButtonAttributes = {
    btnType: "button" | "submit" | "reset";
  };

  let btnType2 = "button"; // inference type = string , mutable
  const btnType = "button"; // inference type = "button"

  const buttonAttributes: ButtonAttributes = { btnType };

  // ===== object property inference

  const modifyButton = (attributes: ButtonAttributes) => {};
  const btnAttributes: ButtonAttributes = {
    btnType: "button", // inference type is string ,
  };

  modifyButton(btnAttributes);

  const modifyButtons = (attributes: ButtonAttributes[]) => {};
  const buttonsToChange: ButtonAttributes[] = [
    { btnType: "button" }, // inference type is string , so must use annotate
    { btnType: "submit" },
  ];
  modifyButtons(buttonsToChange);
}

// ===== readonly object properties
namespace V159 {
  type User = {
    readonly id: number; // TODO: readonly property
    name: string;
    age: number;
  };

  const updateUser = (user: User) => {
    user.name = "Jane";
    user.age = 30;
    // user.id = 1;  // readonly
  };

  // make all property readonly
  const printUser = (user: Readonly<User>) => {
    console.log(` name = ${user.name} at ${user.age}`);
  };
}

//===== "as const"
namespace V163 {
  type ButtonAttributes = {
    btnType: "button" | "submit" | "reset";
  };

  const modifyButton = (attributes: ButtonAttributes) => {};
  const buttonAttributes = {
    btnType: "button",
  } as const; // TODO:  as const - deeply apply readonly to property when inference

  modifyButton(buttonAttributes);
}

// ===== Object freeze - only apply readonly for first level
namespace V165 {
  type ButtonAttributes = {
    btnType: "button" | "submit" | "reset";
  };

  const modifyButton = (attributes: ButtonAttributes) => {};
  const buttonAttributes = Object.freeze({
    // TODO: Object.freeze is runtime, and works only the first level
    cancel: { btnType: "button" },
    confirm: { btnType: "button" },
  });

  // modifyButton(buttonAttributes);  // not worknig
}

// ===== readonly array
namespace V167 {
  function printNames(names: readonly string[]) {
    //TODO:  readonly string[] is equal to ReadonlyArray<string>
    for (const name of names) {
      console.log(name);
    }

    // names.push("John");
    // names[0] = "Billy";
  }
}

//===== readonly   tuple
namespace V170 {
  type Coordinate = readonly [number, number];
  const myHouse: Coordinate = [2, 3];

  const dangerousFunction = (arrrayOfNumbers: number[]) => {
    const x = arrrayOfNumbers.pop();
    const y = arrrayOfNumbers.pop();
    console.log(x, y, arrrayOfNumbers);
    return arrrayOfNumbers;
  };

  // dangerousFunction(myHouse);
}
// ===== @total-typescript/ts-reset - fix checking if random string included in array

// TODO: ===== type inference for an Async function - return as const
namespace V173 {
  type FetchResult = [Error | undefined, any?];
  const fetchData = async () => {
    const response = await fetch("/");
    if (!response.ok) {
      return [new Error("could not fetch data")] as const;
    }
    const data = await response.json();
    return [undefined, data] as const; // not return array, as const
  };

  const example = async () => {
    const [error, data] = await fetchData();
  };
}
