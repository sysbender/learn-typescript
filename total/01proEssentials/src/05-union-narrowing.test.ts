import { setMaxIdleHTTPParsers } from "http";
import { test, expect, it } from "vitest";

test("hello", () => {
  expect("hello").toEqual("hello");
});

function validateUsername(username: string | null): boolean {
  const isUsernameOK = !!username;
  const isUsername = Boolean(username); // Boolean doesn't work for narrowing type
  //   if (username)
  // if ( typeof username === 'string' )
  if (typeof username !== "object") {
    // typeof null === 'object'
    return username.length > 5;
  }

  return false;
}

it("not null username", () => {
  expect(validateUsername("abc1234")).toBe(true);
  expect(validateUsername("abc")).toBe(false);
  expect(validateUsername(null)).toBe(false);
});

//-----------narrowing map , could not use has
type Event = {
  message: string;
};

const processUserMap = (eventMap: Map<string, Event>) => {
  const event = eventMap.get("error");
  // if ( eventMap.get("error"))  // this does not work
  if (event) {
    const message = event.message;
    throw new Error(message);
  }
};

//throwing error to narrow

const appElement = document.getElementById("app");
if (!appElement) {
  throw new Error("Element Not Found");
}
const text = appElement.textContent;
// narrowing with
type ResponseData = { data: { id: string } };
type ResponseError = { error: string };
type APIResponse = ResponseData | ResponseError;

const handleResponse = (response: APIResponse) => {
  if ("data" in response) {
    return response.data.id;
  } else {
    throw new Error(response.error);
  }
};

// unknown

const goWrong = () => {
  throw new Error("Something went wrong");
};

try {
  goWrong();
} catch (error) {
  // if (typeof error === 'object' && error && 'message' in error)  // still unknown
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    throw error; // if not Error , throw again
  }
}

// narrowing unknown to a value
const parseValue = (value: unknown): string => {
  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof value.data === "object" &&
    value.data &&
    "id" in value.data &&
    typeof value.data.id === "string"
  ) {
    return value.data.id;
  }
  throw new Error("Parsing error!");
};

// ======= never

const getNever = () => {
  // inferred return type is never
  throw new Error("Nothing");
};

function getNever2() {
  //  inferred return type is void
  throw new Error("Nothing");
}

let string1: string = getNever();
// let string2: string = getNever2();  // not OK

// - empty array is never array in TS

const shoppingCart: { items: string[] } = { items: [] };

shoppingCart.items.push("Apple");

// return never to narrow

const throwError = (message: string): never => {
  throw new Error(message);
};

type Example = string | never; // Example is string,
const handleSearchParams = (params: { id?: string }) => {
  const id = params.id || throwError("No id provided");
  const id2: string = id;
};

// TODO:  073 narrowing in different scopes - now always carry over narrowing

const findUsersByName = (
  searchParams: { name?: string },
  users: {
    id: string;
    name: string;
  }[]
) => {
  const name = searchParams.name; // let name = searchParams.name;  // mutable won't work
  if (name) {
    //searchParams.name;
    return users.filter((user) => {
      return user.name.includes(name);
    });
  }
};

//074 discriminated unions

type Circle = {
  kind: "circle"; // discriminator
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;

function calculateArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  } else {
    return shape.sideLength * shape.sideLength;
  }
}

// TODO: destructing discriminated union - limited

function calculateArea2(shape: Shape) {
  if (shape.kind === "circle") {
    const { radius } = shape; // destructing
    return Math.PI * radius * radius;
  } else {
    const { sideLength } = shape;
    return sideLength * sideLength;
  }
}

// narrowing a discriminated union with a switch

function calculateArea3(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;

    case "square":
      return shape.sideLength * shape.sideLength;

    // default:
    //   throw new Error("Kind is not valid");
  }
}
// narrowing a discriminated union with a switch  (true)
function calculateArea4(shape: Shape) {
  switch (true) {
    case shape.kind === "circle": {
      return Math.PI * shape.radius * shape.radius;
    }

    case shape.kind === "square": {
      return shape.sideLength * shape.sideLength;
    }
  }
}

// discriminated union of tuples instead of object
namespace V078 {
  type User = { id: string };
  type ErrorResponse = ["error", string];
  type SuccessResponse = ["success", User[]];
  type ApiResponse = SuccessResponse | ErrorResponse; //[string, User[] | string];

  async function fetchData(): Promise<ApiResponse> {
    try {
      const response = await fetch("https://api.example.com/data");

      if (!response.ok) {
        return ["error", "An error occurred"];
      }

      const data = await response.json();
      return ["success", data];
    } catch (error) {
      return ["error", "An error occurred"];
    }
  }

  async function exampleFunc() {
    const [status, value] = await fetchData();
    if (status === "success") {
      const result = value;
    } else {
      const result = value;
    }
  }
}

// 122.079

namespace V079 {
  type User = { id: string };
  type ErrorResponse = [false, string];
  type SuccessResponse = [true, User[]];
  type ApiResponse = SuccessResponse | ErrorResponse; //[string, User[] | string];

  async function fetchData(): Promise<ApiResponse> {
    try {
      const response = await fetch("https://api.example.com/data");

      if (!response.ok) {
        return [false, "An error occurred"];
      }

      const data = await response.json();
      return [true, data];
    } catch (error) {
      return [false, "An error occurred"];
    }
  }

  async function exampleFunc() {
    const [status, value] = await fetchData();
    if (status) {
      const result = value;
    } else {
      const result = value;
    }
  }
}

// TODO: adding defaults to discriminated union - one optional kind

namespace V080 {
  type OptionalCircle = {
    radius: number;
  };
  type Circle = {
    kind?: "circle"; // discriminator
    radius: number;
  };

  type Square = {
    kind: "square";
    sideLength: number;
  };

  type Shape = Circle | Square; //| OptionalCircle;

  function calculateArea(shape: Shape) {
    if (shape.kind === "square") {
      return shape.sideLength * shape.sideLength;
    } else {
      return Math.PI * shape.radius * shape.radius;
    }
  }

  it("default is circle", () => {
    const result = calculateArea({ radius: 5 });
    console.log({ result });
  });
}

// should provide  function return type
