// tsconfig - target
namespace V285 {
  const str: string = "Hello world!";
  str.replaceAll("Hello", "Goodbye"); // only : target: "ES2021" ; doesn't affect runtime
}

// tsconfig -lib
//    "lib": ["ES2022", "DOM"],
namespace V287 {
  document.addEventListener("DOMContentLoaded", () => {
    const app = document.querySelector("#app")!;
    app.innerHTML = "Hello World!";
  });
}

// tsconofig -DOM
//    "lib": ["ES2022", "DOM", "DOM.Iterable"],
namespace V290 {
  const elements = document.querySelectorAll("div");
  for (const element of elements) {
    element.innerHTML = "Hello World!";
  }
}

/*
Situation	Implicit effective "lib"	DOM globals available?
"lib" omitted	["DOM", "DOM.Iterable", "ES2022"]

*/
declare global {
  // declare in global
  interface Window {
    // interface will merge
    DEBUG: {
      getState(): { id: string };
    };
  }
}
namespace V291 {
  const state = window.DEBUG.getState();
}

import { diffChars } from "diff";

namespace V293 {
  const msg1 = "Hello, world!";
  const msg2 = "Goodbye, world!";
  const diff = diffChars(msg1, msg2);
}

// types needed for node  @types/node

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MY_ENV_VAR: string;
    }
  }
}
import process from "process";
namespace V296 {
  const envVaraible = process.env.MY_ENV_VAR;

  if (!envVaraible) {
    throw new Error("MY_ENV_VAR not assigned ");
  }
}

// ===== declare module

import { myModuleFunc } from "my-module";
import { expectTypeOf } from "vitest";
namespace V300 {
  type T = typeof myModuleFunc;
  const k = (): void => {};
  type K = typeof k;
  expectTypeOf((): void => {}).toEqualTypeOf(myModuleFunc);
}

//TODO: import png file
// you can declare wildcard file
import pngUrl1 from "./example1.png"; // need export default
namespace V301 {
  let str = "hello";
  type PngType = typeof pngUrl1;
  expectTypeOf(pngUrl1).toEqualTypeOf("hello" as string);
}
