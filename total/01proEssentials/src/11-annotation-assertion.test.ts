import { it, expect, test, expectTypeOf } from "vitest";

namespace V231 {
  const isProblemOrSolution = (filename: string): boolean => {
    const splitFilename: string[] = filename.split(".");
    const finalIndex: number = splitFilename.length - 1;
    const extension: string | undefined = splitFilename[finalIndex];

    const isProblem: boolean = extension === "problem";
    const isSolution: boolean = extension === "solution";

    return isProblem || isSolution;
  };

  const users = [{ name: "John" }, { name: "Jane" }];

  const usesWithIds = users.map((user, index) => {
    return { ...user, id: index };
  });

  // TODO: You wrap the object literal in parentheses because {} normally starts a block, not an object.
  // Parentheses tell JavaScript to treat it as an expression to be returned directly.
  const usesWithIds2 = users.map((user, index) => {
    ({ ...user, id: index });
  });

  /*
  (method) Array<{ name: string; }>.map
  // returned type by map
  <{
  id: number;
  name: string;
    }>
  
(
  callbackfn: (             // callback accept three parameters
    value: { name: string },
    index: number,
    array: { name: string }[]
  ) => { id: number; name: string },   // callback return type


  thisArg?: any
): { id: number; name: string }[]
*/

  const isProblemOrSolution2 = (filename: string) => {
    const splitFilename = filename.split(".");
    const finalIndex = splitFilename.length - 1;
    const extension = splitFilename[finalIndex];

    const isProblem = extension === "problem";
    const isSolution = extension === "solution";

    return isProblem || isSolution;
  };

  expectTypeOf(isProblemOrSolution).toEqualTypeOf(isProblemOrSolution2);
}

namespace V233 {
  const handleFormData = (e: SubmitEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    // as any to supress warning/error
    const value = Object.fromEntries(data.entries());
    return value;
  };
}

namespace V235 {
  function parseJson<T>(response: string) {
    return JSON.parse(response) as T;
  }
  type MyObj = { a: number; b: number };
  const getObj = () => {
    const response = '{ "a": 123, "b": 456 }';
    const obj = parseJson<MyObj>(response);
    return obj;
  };

  it("should return an obj", () => {
    const obj = getObj();
    expect(obj.b).toEqual(456);

    expect(
      // @ts-expect-error c doesn't exist on obj
      obj.c
    ).toEqual(undefined);
  });
}

namespace V237 {
  //const num1 = "hello" as number
  const number2 = "hello" as unknown as number;
  const num3 = "hello" as any as number;
  const num4 = "hello" as never as number;
}

// non null assertion  - be careful
const findUserByName = (
  searchParams: { name?: string },
  users: { id: string; name: string }[]
) => {
  if (searchParams.name) {
    return users.filter((user) => user.name.includes(searchParams.name!)); //
    return users;
  }
};

// @ts-ignore
// @ts-expect-error
const n = "hello" as number;

// ===== TODO: satisfies
namespace V244 {
  type Color = string | { r: number; g: number; b: number };

  const config = {
    foreground: { r: 255, g: 255, b: 255 },
    background: { r: 0, g: 0, b: 0 },
    border: "transparent",
  } satisfies Record<string, Color>;

  config.border.toUpperCase();
}

// ===== typeof keyof and satisfies

namespace V245 {
  const configurations = {
    developerment: {
      apiBaseUrl: "/dev",
      timeout: 5000,
    },
    production: {
      apiBaseUrl: "/prod",
      timeout: 1000,
      // @ts-expect-error
      notAllowed: true,
    },
  } satisfies Record<string, { apiBaseUrl: string; timeout: number }>;
}

// 'satisfies' , 'as', 'variable annotation'

namespace V247 {
  //1
  const obj: Record<string, number> = {};
  obj.a = 1;
  obj.b = 2;
  expectTypeOf(obj.a).toEqualTypeOf(1);

  //2
  const menuConfig = {
    home: { label: "home", link: "/home" },
    services: {
      label: "services",
      children: [
        { label: "Consuting", link: "/services/consulting" },
        { label: "devlopment", link: "/servers/development" },
      ],
    },
  } satisfies Record<
    string,
    | { label: string; link: string }
    | { label: string; children: { label: string; link: string }[] }
  >;

  expectTypeOf(menuConfig.home.label).toEqualTypeOf("hello");
  expectTypeOf(menuConfig.services.children).toEqualTypeOf([
    { label: "", link: "" },
  ]);
}

namespace V250 {
  const routes = {
    "/": { component: "Home" },
    "/about": {
      component: "About",
      // @ts-expect-error
      search: "?foo=bat",
    },
  } as const satisfies Record<string, { component: string }>;

  // @ts-expect-error
  routes["/"].component = "Abount";

  expectTypeOf(routes["/"]["component"]).toEqualTypeOf("Home" as const);
  expectTypeOf(routes["/about"]["component"]).toEqualTypeOf("About" as const);
}
