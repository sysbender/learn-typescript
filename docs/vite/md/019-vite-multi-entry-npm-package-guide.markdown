# Creating an npm Package with Multiple Entry Points in Vite

This guide builds on the previous lesson, where we created a single-entry-point npm package using Vite’s library mode. Here, we’ll extend the library to support multiple entry points, allowing client applications to import specific functionality from submodules (e.g., `import { log } from 'pluck/log'`). We’ll configure Vite to generate bundles for each entry point and update the client application to test the new setup.

## Prerequisites
- A Vite library project (`lib`) and a client application (`app`) set up as described in the previous lesson.
- The `lib` project contains a `pluck` function in `lib/src/index.js`.
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.

## Step 1: Reviewing the Existing Library
The `lib` project currently has one entry point (`src/index.js`) exporting a `pluck` function:

**`lib/src/index.js`**:
```javascript
export function pluck(array, key) {
  return array.map(item => item[key]);
}
```

The `lib/package.json` specifies this entry point:

```json
{
  "name": "pluck",
  "version": "1.0.0",
  "main": "./dist/index.umd.cjs",
  "module": "./dist/index.js",
  "exports": {
    "import": "./dist/index.js",
    "require": "./dist/index.umd.cjs"
  }
}
```

The client application (`app`) imports and uses the `pluck` function:

**`app/src/main.js`**:
```javascript
import { pluck } from 'pluck';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

console.log(pluck(users, 'name')); // ['Alice', 'Bob', 'Charlie']
```

## Step 2: Adding a New Entry Point
We’ll add a second entry point to the library by creating a new file (`log.js`) with a `log` function.

1. Create `lib/src/log.js`:

```javascript
export function log(...args) {
  console.log(...args);
}
```

### Explanation
- The `log` function is a simple wrapper around `console.log` for demonstration purposes.
- This will be the second entry point, importable as `import { log } from 'pluck/log'`.

## Step 3: Updating the Client Application (Preview)
To test the new entry point, update the client application to use both `pluck` and `log` functions.

1. Modify `app/src/main.js`:

```javascript
import { pluck } from 'pluck';
import { log } from 'pluck/log';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

log(pluck(users, 'name')); // Log: ['Alice', 'Bob', 'Charlie']
```

### Note
This code won’t work yet because we haven’t configured the library to support the `pluck/log` submodule. Let’s fix that next.

## Step 4: Configuring Vite for Multiple Entry Points
Update the Vite configuration to generate bundles for both `index.js` and `log.js`.

1. Modify `lib/vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: [
        path.resolve(__dirname, 'src/index.js'),
        path.resolve(__dirname, 'src/log.js')
      ],
      name: 'Pluck',
      fileName: (format, entryName) => {
        if (format === 'es') {
          return `${entryName}.js`;
        }
        return `${entryName}.${format}.cjs`;
      }
    }
  }
});
```

### Explanation
- `entry`: Changed from a single file to an array of files (`index.js` and `log.js`), specifying multiple entry points.
- `fileName`: A function that customizes output file names based on:
  - `format`: Either `es` (ES modules) or `umd` (CommonJS/UMD).
  - `entryName`: The base name of the source file (`index` or `log`).
  - For ES modules, outputs `index.js` and `log.js`.
  - For CommonJS/UMD, outputs `index.umd.cjs` and `log.umd.cjs`.

2. Build the library:

```bash
cd lib
npm run build
```

3. Check the `lib/dist` folder:
   - Generated files:
     - `dist/index.js` (ES module for `pluck`)
     - `dist/index.umd.cjs` (CommonJS/UMD for `pluck`)
     - `dist/log.js` (ES module for `log`)
     - `dist/log.umd.cjs` (CommonJS/UMD for `log`)

## Step 5: Updating `package.json` for Submodules
Modify `lib/package.json` to support importing the `log` submodule and update file paths to match the new naming convention.

1. Update `lib/package.json`:

```json
{
  "name": "pluck",
  "version": "1.0.0",
  "main": "./dist/index.umd.cjs",
  "module": "./dist/index.js",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.umd.cjs"
    },
    "./log": {
      "import": "./dist/log.js",
      "require": "./dist/log.umd.cjs"
    }
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

### Explanation
- `main` and `module`: Point to the primary entry point (`index.js` and `index.umd.cjs`).
- `exports`: Defines submodules:
  - `.`: The main entry point (`pluck` for `import { pluck } from 'pluck'`).
  - `./log`: The `log` submodule (`pluck/log` for `import { log } from 'pluck/log'`).
- `import` and `require`: Specify paths for ES modules and CommonJS, respectively.

## Step 6: Relinking the Library
Since we’ve modified the library, relink it to the client application.

1. In the `lib` project, make the library globally available:

```bash
cd lib
npm link
```

2. In the `app` project, link the updated library:

```bash
cd ../app
npm link pluck
```

## Step 7: Testing the Multi-Entry Package
Run the client application to verify that both entry points work.

1. Start the client application’s development server:

```bash
cd app
npm run dev
```

2. Open the browser (usually at `http://localhost:5173`) and check the console:
   - You should see `['Alice', 'Bob', 'Charlie']` logged by the `log` function from the `pluck/log` submodule.
   - This confirms that both `pluck` (from `pluck`) and `log` (from `pluck/log`) are correctly imported.

3. Optionally, modify `app/src/main.js` to use `log` with `pluck` differently:

```javascript
import { pluck } from 'pluck';
import { log } from 'pluck/log';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

log('User names:', pluck(users, 'name')); // Log: User names: ['Alice', 'Bob', 'Charlie']
```

4. Restart the dev server and check the console again. The output should reflect the updated log.

## Step 8: Understanding the Setup
- **Multiple Entry Points**: By specifying an array of entries in `vite.config.js`, Vite generates separate bundles for each file (`index.js` and `log.js`).
- **Custom File Names**: The `fileName` function ensures distinct names for ES and CommonJS bundles, avoiding conflicts.
- **Submodule Imports**: The `exports` field in `package.json` allows client applications to import submodules (e.g., `pluck/log`).
- **npm link**: Enables local testing without publishing to npm, creating a symlink to the library’s source code.
- **Generated Files**:
  - `index.js` and `index.umd.cjs`: For the `pluck` function.
  - `log.js` and `log.umd.cjs`: For the `log` function.

## Additional Notes
- **TypeScript Support**: If using TypeScript, create type definitions (e.g., `lib/src/index.d.ts` and `lib/src/log.d.ts`) and add `"types": "./dist/index.d.ts"` to `package.json`.
- **Publishing to npm**: To publish, run `npm publish` in the `lib` project after verifying the setup (covered in a future lesson).
- **Best Practices**:
  - Use clear submodule names (e.g., `log`) for intuitive imports.
  - Test all entry points in the client application to ensure compatibility.
  - Keep entry point files focused on specific functionality to maintain modularity.
- **Extending the Library**: Add more entry points by creating additional files (e.g., `src/utils.js`) and updating `vite.config.js` and `package.json` accordingly.

This setup enables Vite to build a library with multiple entry points, allowing client applications to import specific functionality from submodules efficiently.