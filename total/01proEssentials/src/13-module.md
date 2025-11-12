Here’s a concise **TypeScript Module & Declaration File Tutorial** in **Markdown** format — clean, practical, and with code examples.

 

# 里 TypeScript Modules vs Scripts & Declaration Files

This guide explains how **TypeScript modules**, **scripts**, and **declaration files (`.d.ts`)** work — including how to define global types and use `declare`.

---

## 1. Module vs Script in TypeScript

In TypeScript, a file is treated as a **module** or a **script** depending on whether it uses `import` or `export`.

```ts
// example.ts
export const name = "TypeScript"; // ✅ This makes the file a module
```

If a file **does not contain** any `import` or `export`, it’s treated as a **script** (global scope).

```ts
// script.ts
const message = "I am a script"; //  Declared in global scope
```

---

## 2. `moduleDetection` in `tsconfig.json`

You can control how TypeScript detects modules using the `moduleDetection` compiler option:

```json
{
  "compilerOptions": {
    "moduleDetection": "force" // or "auto"
  }
}
```

* `"auto"` → TypeScript decides automatically (default)
* `"force"` → Forces TypeScript to treat all `.ts` files as modules (except `.d.ts`)

>  Note: This setting **only applies to `.ts` files**, not `.d.ts` files.

---

## 3. Declaration Files (`.d.ts`)

Declaration files describe **types only** — no runtime code is allowed.

```ts
// math.d.ts
declare function add(a: number, b: number): number;
```

> ⚠️ You can’t put executable code here (e.g., `console.log()`).

You import from a declaration file **without the `.d.ts`** extension:

```ts
// usage.ts
import { add } from "./math";
```

---

## 4. Making a `.d.ts` File a Module

If a `.d.ts` file contains `export {}` or any `import`, it becomes a **module**, not a script.

```ts
// types.d.ts
export {}; //  Marks this as a module

declare global {
  interface Window {
    appVersion: string;
  }
}
```

Now, global declarations are scoped correctly and won’t pollute other files.

---

## 5. Exporting Types for a JavaScript File

If you have a plain JavaScript file but want to provide type definitions:

```js
// logger.js
exports.log = (msg) => console.log(msg);
```

Create a matching declaration file:

```ts
// logger.d.ts
export {}; //  Required to make this a module

export function log(msg: string): void;
```

Now you can use it safely in TypeScript:

```ts
// main.ts
import { log } from "./logger";
log("Hello TypeScript!");
```

---

## 6. Using `declare` for Ambient Declarations

Use `declare` to **tell TypeScript** that something exists without providing an implementation.

```ts
// local.ts
declare const DEBUG: boolean;

if (DEBUG) {
  console.log("Debugging mode enabled!");
}
```

This declaration is **local** to the file — it’s not shared with other files.

---

## 7. Making Declarations Global

To share a declaration across multiple files, wrap it in a `declare global` block inside a `.d.ts` file:

```ts
// globals.d.ts
declare global {
  const DEBUG: boolean;
}
```

Now `DEBUG` is available everywhere in your project.

---

## ✅ Summary

| Concept              | Description                                   | Example                                   |
| -------------------- | --------------------------------------------- | ----------------------------------------- |
| **Module**           | File with `import` or `export`                | `export const x = 1;`                     |
| **Script**           | No `import`/`export`; global scope            | `const y = 2;`                            |
| **moduleDetection**  | Controls how TS treats files                  | `"force"`, `"auto"`                       |
| **`.d.ts` file**     | Type declarations only                        | `declare function foo(): void;`           |
| **`export {}`**      | Makes `.d.ts` a module                        | `export {};`                              |
| **`declare`**        | Declares variable/type without implementation | `declare const DEBUG: boolean;`           |
| **`declare global`** | Adds global declarations                      | `declare global { const DEBUG: boolean }` |

 