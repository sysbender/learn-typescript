import { hasUncaughtExceptionCaptureCallback } from "process";
import { test, expect } from "vitest";

// =====extend object using intersection

namespace V127 {
  type BaseEntity = {
    id: string;
    createdAt: Date;
    name: string;
  };

  type User = BaseEntity & {
    email: string;
  };

  type Product = BaseEntity & {
    price: number;
  };
}

//===== extend object using interfaces
// interface represent object type
namespace V129 {
  interface BaseEntity {
    id: string;
    createdAt: Date;
    name: string;
  }

  interface User extends BaseEntity {
    email: string;
  }

  interface Product extends BaseEntity {
    price: number;
  }

  const user: User = {
    id: "123",
    createdAt: new Date(),
    name: "John",
    email: "john@gmail.com",
  };

  console.log(user);
}

//===== extending imcompatible properties

namespace V131 {
  interface UserPart {
    id: string;
    name: string;
    age: number;
  }

  interface UserPart2 {
    phone: string;
  }

  interface User extends UserPart, UserPart2 {}

  const user: User = {
    id: "1",
    name: "john",
    age: 20,
    phone: "123456789",
  };
}

// ===== compare : type intersection ,  use interface extends when you can (only object)

//TODO: =====  index signature

namespace V134 {
  type ScoresType = {
    [subject: string]: number;
  };

  interface ScoresInterface {
    [index: string]: number;
  }
  const scores: ScoresInterface = {};
  scores.math = 95;
  scores.english = 90;
  scores.science = 85;

  // helper type - record
  const scores2: Record<string, number> = {};
  scores2.math = 99;
}

// ===== index signature with defined keys
namespace V136 {
  interface Scores {
    math: number;
    english: number;
    science: number;
    [subject: string]: number;
  }
  const scores: Scores = {
    math: 95,
    english: 90,
    science: 45,
  };

  scores.french = 75;

  // interface extends

  interface RequiredScores {
    math: number;
    english: number;
    science: number;
  }

  interface Scores2 extends RequiredScores {
    [key: string]: number;
  }

  const scores2: Scores2 = {
    math: 12,
    english: 34,
    science: 56,
    french: 9,
  };
}

//TODO:  ===== property key type

//type PropertyKey = string | number | symbol
namespace V138 {
  const hasKey = (obj: object, key: PropertyKey) => {
    return obj.hasOwnProperty(key);
  };

  const obj1 = { foo: "bar" };
  const result1 = hasKey(obj1, "foo");

  const obj2 = { 1: "bar" };
  const result2 = hasKey(obj2, 1);
}

// TODO: ===== record type with union as keys , mapped type
namespace V140 {
  type Environment = "development" | "production" | "staging";
  type Configuration = Record<Environment, object>;
  const configurations: Configuration = {
    development: {
      apiBaseUrl: "http://localhost:8080",
      timeout: 5000,
    },
    production: {},
    staging: {},
    // notallowed: {},
  };
  console.log(configurations);

  // solution2 : mapped type
  type Configuration2 = { [Env in Environment]: object };
}

// TODO: ===== declaration merging of interfaces
namespace V142 {
  // duplicated interfaces are merged , duplicated type definition are not allowed
  interface Logger {
    log(message: string, level: number): void;
  }
  interface Logger {
    log(message: string): void;
  }
  const myLogger: Logger = {
    log: (message: string) => {
      console.log(message);
    },
  };

  myLogger.log("my-message", 123);
}

// TODO: ===== pick type helper - only works on object
namespace V144 {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  const fetchUser = async (): Promise<User> => {
    const response = await fetch("/api/user");
    const user = await response.json();
    return user;
  };

  type PartialUser = Pick<User, "email" | "name">;
  const example = async () => {
    const user: PartialUser = await fetchUser();
    console.log(user);
  };
}

// ===== omit type  helper
namespace V146 {
  interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
  }
  const addProduct = (productInfo: Omit<Product, "id">) => {};

  addProduct({
    name: "book",
    price: 12,
    description: "a book",
  });
}

// TODO:  ===== distributive Omit and Pick - to work with object union
namespace V149 {
  type User = {
    id: string;
    name: string;
    age: number;
  };

  type Product = {
    id: string;
    name: string;
    price: number;
  };

  type Entity = User | Product;

  type DistributiveOmit<T, K extends PropertyKey> = T extends any
    ? Omit<T, K>
    : never;

  // keep the union  : Omit<User, 'id'> | Omit<Product, 'id'>
  type EntityWithoutId = DistributiveOmit<Entity, "id">;

  //{name:string, }
  type EntityWithoutId2 = Omit<Entity, "id">;
}

// TODO: partial type helper - make all optional in object optional ; require does the opposite
namespace V150 {
  interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
  }

  const updateProduct = (
    id: number,
    productInfo: Partial<Omit<Product, "id">>
  ) => {};

  updateProduct(1, { name: "Book" });
}

// TODO: common keys of unions of objects
namespace V153 {
  type User = {
    id: string;
    name: string;
    address: string;
    age: number;
    imageId: string;
  };

  type Product = {
    id: string;
    name: string;
    price: number;
    imageId: string;
  };

  const getAvatarImage = (entity: User | Product) => {
    //should not access properties that are not common to both types
    // entity.age;
    // entity.address;
    return {
      url: `${entity.imageId}`,
      alt: `${entity.name}`,
    };
  };
}

