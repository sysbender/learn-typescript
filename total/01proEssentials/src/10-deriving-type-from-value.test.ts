import { error } from "console";
import { create } from "domain";
import { it, expect, expectTypeOf } from "vitest";

// deriving types

// keyof
namespace V207 {
  interface FromValues {
    name: string;
    email: string;
    password: string;
  }
  //"name" | "email" | "password"

  type KeyUnion = keyof FromValues;
  const inputs: Record<
    keyof FromValues,
    { initialValue: string; label: string }
  > = {
    name: { initialValue: "", label: "Name" },
    email: { initialValue: "", label: "Email" },
    password: { initialValue: "", label: "Password" },
  };
}

// typeof

namespace V209 {
  const configurations = {
    development: { apiBaseUrl: "/dev" },
    production: { apiBaseUrl: "/prod" },
    staging: { apiBaseUrl: "/stag" },
  };

  type Configurations = typeof configurations;

  type Environments = keyof Configurations;
}

//
namespace V212 {
  class CanvasNode {
    x = 0;
    y = 0;
    move(x: number, y: number): this {
      // "this" is type and value the same time
      this.x += x;
      this.y += y;
      return this;
    }
  }

  const positionFromCanvasNode = (node: CanvasNode) => {
    return {
      x: node.x,
      y: node.y,
    };
  };

  const node = new CanvasNode().move(10, 10).move(5, 5);
}

// ===== Using the Same Name for Values and Types

namespace V216 {
  type Role = "ADMIN" | "USER";
  const Role = {
    ADMIN: "ADMIN" as Role,
    USER: "USER" as Role,
  };

  function assign(role: Role) {}
  assign(Role.ADMIN);
}

// TODO: =====  Creating Types from Complex Function Parameters
// If you give it a function type, it gives you a tuple of that function’s argument types.
namespace V217 {
  const makeQuery = (
    url: string,

    opts?: {
      method?: string;
      headers?: {
        [key: string]: string;
      };
      body?: string;
    }
  ) => {};

  type MakeQueryParameters = Parameters<typeof makeQuery>;
}
// return type
namespace V220 {
  const createUser = (id: string) => {
    return {
      id,
      name: "John Doe",
      email: "john.doe@gmail.com",
    };
  };

  type User = ReturnType<typeof createUser>;
}

// TODO: Extract the Return Type from an Async Function
namespace V222 {
  const featureUser = async (id: string) => {
    return {
      id,
      name: "John Doe",
      email: "john.doe@gmail.com",
    };
  };

  type User = Awaited<ReturnType<typeof featureUser>>; //unwraps a promise type
}

// ===== TODO: Indexed Access Type -   Access Specific Values in an as const Object
// indexed access type = look up a specific property’s type on another type

namespace V223 {
  export const programModeEnumMap = {
    GROUP: "group",
    ONE_ON_ONE: "1on1",
    PLANNED_ONE_ON_ONE: "planned1on1",
  } as const;

  type ProgramModeMap = typeof programModeEnumMap;
  type Group = ProgramModeMap["GROUP"]; // indexed access type
  type ONE_ON_ONE_TYPES = ProgramModeMap["ONE_ON_ONE" | "PLANNED_ONE_ON_ONE"]; // pass unions to index access types

  type ALL_Programs =
    (typeof programModeEnumMap)[keyof typeof programModeEnumMap]; // pass keyof into an indexed access type
}

// ===== TODO: Create a Union from an as const Array
namespace V229 {
  export const programModeEnumMap = ["group", "1on1", "planned1on1"] as const;
  type TOP2_Programs = (typeof programModeEnumMap)[0 | 1]; // get the first and second

  type ALL_Programs = (typeof programModeEnumMap)[number]; //“the type of any element when indexed by a number”
}
