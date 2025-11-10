// ----- bundler will translate TS feature into JS ?

import { it, expect, vi } from "vitest";
// parameter properties - desiganation public/private in constructor parameter

namespace V196 {
  class Person {
    constructor(public name: string, private age: number) {}
  }

  /**js
    "use strict";
  class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
  }
   */
}

namespace V197 {
  enum LogLevle {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
  }

  type LogOptions = {
    globalLogLevel: LogLevle;
    level: LogLevle;
    message: string;
  };
  function log(opts: LogOptions) {
    if (opts.level >= opts.globalLogLevel) {
      console.log(opts.message);
    }
  }

  it("should log ", () => {
    const consoleLog = vi.spyOn(console, "log");
    const message = "Error - this is an error.";
    log({
      globalLogLevel: LogLevle.INFO,
      level: LogLevle.ERROR,
      message,
    });

    expect(consoleLog).toHaveBeenCalledWith(message);
  });

  it("should  not log ", () => {
    const consoleLog = vi.spyOn(console, "log");
    const message = "Info: this is an info.";
    log({
      globalLogLevel: LogLevle.ERROR,
      level: LogLevle.INFO,
      message,
    });

    expect(consoleLog).not.toHaveBeenCalledWith(message);
  });

  it("should give TS error when pass an invalid log level", () => {
    log({
      globalLogLevel: LogLevle.INFO,
      // @ts-expect-error
      level: 123,
      message: "hello",
    });
  });
}

// string enum
namespace V199 {
  enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
  }

  const request = (url: string, method: Method) => {};

  it("should use enum", () => {
    request(
      "/",
      //@ts-expect-error"
      "GET"
    );
  });
}

// const enum - disappeaar at runtime  (not recomended )

// namespace - avoid name conflict. (module can do this too?)

// namespace and interface merging declaration

namespace V204 {
  export namespace Rectange {
    export interface IRectange {
      width: number;
      height: number;
    }
  }
}

namespace V204 {
  export namespace Rectange {
    export interface IRectange {
      color: string;
    }
  }
}

// @ts-expect-error color required!
class Rect implements V204.Rectange.IRectange {
  width: number = 0;
  height: number = 0;
  // color: string = "red";
}

const rect: V204.Rectange.IRectange = {
  width: 20,
  height: 10,
  color: "green",
};
