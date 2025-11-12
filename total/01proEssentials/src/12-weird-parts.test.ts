import { on } from "events";
import { it, test, expect, expectTypeOf, vi } from "vitest";

// ===== TODO: empty object - anything can be assigned to empty object , except null and undefined
//  unknown = {} | null  | undefined
// {} = {a:string} | string | number | boolean | symbol |  ()=>{}
namespace V251 {
  const exceptNullUndefined = (input: {}) => {};

  exceptNullUndefined("hello");
  exceptNullUndefined(42);
  exceptNullUndefined(true);
  exceptNullUndefined(Symbol("foo"));
  exceptNullUndefined(() => {});
  exceptNullUndefined(new Error("foo"));

  // @ts-expect-error
  exceptNullUndefined(null);
  // @ts-expect-error
  exceptNullUndefined(undefined);
}

// ===== TODO: a true empty object
namespace V253 {
  const onlyEmptyObject = (input: Record<PropertyKey, never>) => {}; //PropertyKey include all the type can be used as key
  onlyEmptyObject({});

  // @ts-expect-error
  onlyEmptyObject({ a: 1 });
  // @ts-expect-error
  onlyEmptyObject("hello");
  // @ts-expect-error
  onlyEmptyObject(Symbol("Foo"));
  // @ts-expect-error
  onlyEmptyObject(new Error("foo"));
  // @ts-expect-error
  onlyEmptyObject(() => {});
  // @ts-expect-error
  onlyEmptyObject(null);
  // @ts-expect-error
  onlyEmptyObject(undefined);
}

// ===== trigger excess properties warning in parameter : use type annotation or satisfies or inline the variable
namespace V255 {
  interface FetchOptions {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  }

  const options: FetchOptions = {
    url: "/",
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // @ts-expect-error
    search: new URLSearchParams({ limit: "10 " }),
  } satisfies FetchOptions;
  const myFetch = async (options: FetchOptions) => {};
  myFetch(options);
}

// ===== trigger excess properties warning in function -
//  1. add return type to callback function , or add satisfies to the value
namespace V257 {
  interface User {
    id: number;
    name: string;
  }

  const users = [{ name: "Jonh" }, { name: "Jane" }];

  const usersWithIds: User[] = users.map((user, index) => {
    return {
      ...user,
      id: index,
      // @ts-expect-error
      age: 31,
    } satisfies User;
  });
}
// iterating over object keys -
namespace V260 {
  interface User {
    id: number;
    name: string;
  }

  //   function printUser(user: User) {
  //     for (const entry of Object.entries(user)) {
  //       console.log(entry[1]);
  //     }
  //   }

  function printUser(user: User) {
    for (const key of Object.keys(user) as Array<keyof User>) {
      const value = user[key];
      console.log(value);
    }
  }
  function printUser2(user: User) {
    for (const key in user) {
      console.log(user[key as keyof User]);
    }
  }
  function printerObjectValue(obj: Record<string, any>) {
    Object.keys(obj).forEach((key) => {
      console.log(obj[key]);
    });
  }

  it("should log all the keys", () => {
    const consoleSpy = vi.spyOn(console, "log");
    printUser({
      id: 1,
      name: "John",
    });

    expect(consoleSpy).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledWith("John");
  });
}

// evolving any and arraY
namespace V262 {
  let selectedId; // infered as any
  selectedId = 123;
  const p = selectedId.toPrecision(2); // autocomple as number

  selectedId = "123";
  const u = selectedId.toUpperCase(); // autocomplete as  string

  //
  const arr = [];
  arr.push(1);
  expectTypeOf(arr).toEqualTypeOf([1]);
  arr.push("a");
  expectTypeOf(arr).toEqualTypeOf([1, "1"]);

  it("print", () => {
    console.log({ p, u });
  });
}

// TODO: function parameter
namespace V266 {
  type Event = "click" | "hover" | "scroll";
  type CallbackType = (event: Event, x: number, y: number) => void; // the function can use less arguments than provided

  const listenToEvent = (callback: CallbackType) => {};

  listenToEvent(() => {});
  listenToEvent((event) => {
    console.log(event);
  });
  listenToEvent((event, x, y) => {});
}

// ===== union of functions with object params
namespace V267 {
  const logId = (obj: { id: string }) => {
    console.log(obj.id);
  };
  const logName = (obj: { name: string }) => {
    console.log(obj.name);
  };

  const loggers = [logId, logName];

  const logAll = (obj: { id: string; name: string }) => {
    loggers.forEach((log) => {
      log(obj);
    });
  };

  it("should log id and name ", () => {
    const consoleSpy = vi.spyOn(console, "log");
    logAll({ id: "123", name: "John" });
    expect(consoleSpy).toHaveBeenCalledWith("123");
    expect(consoleSpy).toHaveBeenCalledWith("John");
  });
}

//  TODO: union of function

namespace V269 {
  const objOfFunctions = {
    string: (input: string) => input.toUpperCase(),
    number: (input: number) => input.toFixed(2),
    boolean: (input: boolean) => (input ? "true" : "false"),
  };

  const format = (input: string | number | boolean) => {
    const inputType = typeof input as "string" | "number" | "boolean";
    const formatter = objOfFunctions[inputType] as (
      arg: typeof input
    ) => string;

    return formatter(input); // or input as never
  };
}
// union of function return type
namespace V271 {
  const idToUppercase = (obj: { id: string }) => {
    return obj.id.toUpperCase();
  };

  const idToInt = (obj: { id: string }) => {
    return parseInt(obj.id);
  };

  const funcs = [idToUppercase, idToInt];

  const resolveAll = (obj: { id: string }) => {
    return funcs.map((func) => {
      return func(obj);
    });
  };

  const result = resolveAll({ id: "123" });
}

// TODO: annotating error a function throws = not posssible
namespace V272 {
  type PossibleErrors = SyntaxError | DOMException;

  type GetUserReturnType =
    | { success: true; data: any }
    | { success: false; error: SyntaxError | DOMException };

  const getUserFromLocalStorage = (id: string): GetUserReturnType => {
    try {
      const user = localStorage.getItem(id);
      if (!user) {
        return {
          success: true,
          data: undefined,
        };
      }
      return { success: true, data: JSON.parse(user) };
    } catch (
      e // e is infered as unknown
    ) {
      if (e instanceof SyntaxError) {
        return { success: false, error: e };
      }

      if (e instanceof SyntaxError) {
        return { success: false, error: e };
      }

      throw e;
    }
  };
}
