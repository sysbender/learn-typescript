# Supporting CommonJS and ES Modules in a Vite npm Package

This guide extends the previous lesson, where we created a Vite library with multiple entry points (`pluck` and `log`). We’ll now explore how to support both ES module (`import`) and CommonJS (`require`) syntax in a client application, ensuring compatibility with different module systems. We’ll test the library using CommonJS and verify the importance of the generated CommonJS bundles.

## Prerequisites
- A Vite library project (`lib`) and a client application (`app`) set up as described in the previous lesson.
- The `lib` project contains:
  - `src/index.js`: Exports the `pluck` function.
  - `src/log.js`: Exports the `log` function.
  - `vite.config.js`: Configured for multiple entry points.
  - `package.json`: Defines entry points for ES and CommonJS modules.
- The `app` project imports `pluck` and `log` using ES modules.
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.

## Step 1: Reviewing the Library Setup
The `lib` project is configured to generate bundles for both ES modules and CommonJS:

**`lib/src/index.js`**:
```javascript
export function pluck(array, key) {
  return array.map(item => item[key]);
}
```

**`lib/src/log.js`**:
```javascript
export function log(...args) {
  console.log(...args);
}
```

**`lib/vite.config.js`**:
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

**`lib/package.json`**:
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

The `app` project currently uses ES modules:

**`app/src/main.js`**:
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

Running `npm run dev` in the `app` project shows the expected output in the browser console.

## Step 2: Testing CommonJS Imports
We’ll modify the client application to use CommonJS (`require`) instead of ES modules (`import`) and test the library in a Node.js environment.

1. **Create a CommonJS Script**:
   Instead of modifying `app/src/main.js`, create a copy named `app/src/main.cjs` to use CommonJS syntax:

```javascript
const { pluck } = require('pluck');
const { log } = require('pluck/log');

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

log('User names:', pluck(users, 'name')); // Log: User names: ['Alice', 'Bob', 'Charlie']
```

2. **Revert `app/src/main.js`**:
   Ensure `app/src/main.js` remains unchanged, using ES modules:

```javascript
import { pluck } from 'pluck';
import { log } from 'pluck/log';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

log('User names:', pluck(users, 'name'));
```

3. **Test in Node.js**:
   Run the CommonJS script in the `app` project:

```bash
cd app
node src/main.cjs
```

4. **Expected Output**:
   The terminal should display:
   ```
   User names: [ 'Alice', 'Bob', 'Charlie' ]
   ```

   This confirms that the `pluck` and `log` functions work correctly when imported via `require`, using the `index.umd.cjs` and `log.umd.cjs` files specified in `lib/package.json`.

## Step 3: Simulating a Missing CommonJS Bundle
To understand the importance of the CommonJS bundles, let’s remove them and test the impact.

1. **Remove CommonJS Bundles**:
   In the `lib` project, delete the CommonJS files:

```bash
cd lib
rm dist/index.umd.cjs dist/log.umd.cjs
```

2. **Rebuild the Library**:
   To ensure the files aren’t regenerated, temporarily modify `lib/vite.config.js` to disable CommonJS output:

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
      },
      formats: ['es'] // Only generate ES modules
    }
  }
});
```

3. Rebuild the library:

```bash
npm run build
```

4. Check the `lib/dist` folder:
   - Only `dist/index.js` and `dist/log.js` are generated.
   - `dist/index.umd.cjs` and `dist/log.umd.cjs` are missing.

5. Relink the library:

```bash
cd lib
npm link
cd ../app
npm link pluck
```

6. Run the CommonJS script again:

```bash
cd app
node src/main.cjs
```

7. **Expected Error**:
   You’ll see an error like:
   ```
   Error: Cannot find module './dist/index.umd.cjs'
   ```
   This occurs because `lib/package.json` specifies `index.umd.cjs` and `log.umd.cjs` for `require`, but these files are missing.

8. **Restore CommonJS Support**:
   Revert `lib/vite.config.js` to include both formats:

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

9. Rebuild and relink:

```bash
cd lib
npm run build
npm link
cd ../app
npm link pluck
```

10. Run the CommonJS script again:

```bash
node src/main.cjs
```

    The output should again be:
    ```
    User names: [ 'Alice', 'Bob', 'Charlie' ]
    ```

## Step 4: Understanding the Dual-Format Support
- **Why Two Bundles?**:
  - Vite generates two sets of files for each entry point:
    - ES modules (`index.js`, `log.js`): For modern environments using `import` (e.g., browsers, Vite, Webpack).
    - CommonJS/UMD (`index.umd.cjs`, `log.umd.cjs`): For Node.js or older environments using `require`.
  - The `package.json` `exports` field maps `import` to `.js` files and `require` to `.umd.cjs` files.

- **How It Works**:
  - When using `import { pluck } from 'pluck'`, Node.js/Vite looks at `exports.import` (`dist/index.js`).
  - When using `require('pluck')`, Node.js looks at `exports.require` (`dist/index.umd.cjs`).
  - Similarly, `import { log } from 'pluck/log'` uses `dist/log.js`, and `require('pluck/log')` uses `dist/log.umd.cjs`.

- **Importance of CommonJS**:
  - Removing `.umd.cjs` files breaks `require` imports, as seen in the error above.
  - Including both formats ensures compatibility with diverse environments (e.g., Node.js scripts, older JavaScript projects).

## Step 5: Verifying ES Module Imports
Confirm that ES module imports still work:

1. Run the client application’s development server:

```bash
cd app
npm run dev
```

2. Open the browser (usually at `http://localhost:5173`) and check the console:
   - You should see `User names: ['Alice', 'Bob', 'Charlie']`, confirming that `app/src/main.js` (using `import`) works with the ES module bundles (`dist/index.js`, `dist/log.js`).

## Additional Notes
- **TypeScript Support**:
  - If using TypeScript, ensure type definitions (e.g., `lib/src/index.d.ts`, `lib/src/log.d.ts`) are included and referenced in `package.json` via `"types"`.
- **Publishing to npm**:
  - The current setup uses `npm link` for local testing. To publish, run `npm publish` in the `lib` project after verifying all entry points.
- **Best Practices**:
  - Always generate both ES and CommonJS bundles to maximize compatibility.
  - Use clear naming conventions in `fileName` to avoid conflicts (e.g., `index.umd.cjs` vs. `index.js`).
  - Test both ES and CommonJS imports in client applications to ensure robustness.
- **Extending the Library**:
  - Add more entry points by including additional files in `vite.config.js` and updating `package.json`’s `exports` field.
- **Node.js Execution**:
  - The `.cjs` extension is required for CommonJS modules in Node.js to avoid errors like `require is not defined`.

This setup ensures your Vite library supports both ES modules and CommonJS, providing flexibility for client applications in browser and Node.js environments.