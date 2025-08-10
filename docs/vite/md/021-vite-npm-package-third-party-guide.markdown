# Integrating Third-Party Libraries in a Vite npm Package

This guide builds on the previous lessons, where we created a Vite library (`pluck`) with multiple entry points (`pluck` and `log`) and tested it in a client application. In this lesson, we’ll integrate a third-party library (`collect.js`) into the `pluck` library, optimize the build to exclude the third-party dependency, and address issues when using it in the client application.

## Prerequisites
- A Vite library project (`lib`) and a client application (`app`) set up as described in previous lessons.
- The `lib` project contains:
  - `src/index.js`: Exports the `pluck` function.
  - `src/log.js`: Exports the `log` function.
  - `vite.config.js`: Configured for multiple entry points.
  - `package.json`: Defines entry points for ES and CommonJS modules.
- The `app` project imports `pluck` and `log` using ES modules.
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.

## Step 1: Reviewing the Current Setup
The `app` project uses the `pluck` library, importing from both the main module and the `log` submodule:

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

The `lib` project has two entry points:

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

The `lib` project is configured to generate ES and CommonJS bundles:

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

The library is linked to the `app` project using `npm link`.

## Step 2: Integrating a Third-Party Library
We’ll modify the `pluck` function to use the `collect.js` library, which provides utilities for working with arrays and objects.

1. **Install `collect.js` in the `lib` Project**:
   In the `lib` project, install `collect.js`:

```bash
cd lib
npm install collect.js
```

2. **Update `lib/src/index.js`**:
   Rename the `pluck` function to `pluckAndLog` and use `collect.js` to extract keys, logging the result:

```javascript
import collect from 'collect.js';

export function pluckAndLog(array, key) {
  const result = collect(array).pluck(key).all();
  console.log('Pluck result:', result);
  return result;
}
```

### Explanation
- `collect(array).pluck(key)`: Uses `collect.js` to extract the specified `key` from each object in `array`.
- `.all()`: Converts the `collect.js` collection to a plain array.
- The function logs the result and returns it.

## Step 3: Building the Library
Build the library to see the impact of including `collect.js`:

```bash
cd lib
npm run build
```

### Initial Build Output
- Check the `lib/dist` folder:
  - `dist/index.js`: The ES module bundle is now ~60 KB (previously much smaller).
  - `dist/index.umd.cjs`: The CommonJS bundle is also larger.
  - `dist/log.js` and `dist/log.umd.cjs`: Unchanged, as `log.js` doesn’t use `collect.js`.
- The size increase is due to Vite bundling the entire `collect.js` source code into `index.js` and `index.umd.cjs`.

## Step 4: Testing in the Client Application
Update the `app` project to use the new `pluckAndLog` function.

1. **Update `app/src/main.js`**:
   Since `pluckAndLog` now logs the result internally, remove the explicit `log` call:

```javascript
import { pluckAndLog } from 'pluck';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

pluckAndLog(users, 'name'); // Logs: Pluck result: ['Alice', 'Bob', 'Charlie']
```

2. **Relink the Library**:
   Ensure the updated library is linked:

```bash
cd lib
npm link
cd ../app
npm link pluck
```

3. **Run the Client Application**:
   Start the development server:

```bash
cd app
npm run dev
```

4. Open the browser (usually at `http://localhost:5173`) and check the console:
   - Expected output: `Pluck result: { items: ['Alice', 'Bob', 'Charlie'] }`.
   - Note: `collect.js` wraps the result in an object with an `items` property.

## Step 5: Optimizing the Build with External Dependencies
The large bundle size is suboptimal. We’ll configure Vite to exclude `collect.js` from the bundle, treating it as an external dependency.

1. **Update `lib/vite.config.js`**:
   Add `rollupOptions.external` to exclude `collect.js`:

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
    },
    rollupOptions: {
      external: ['collect.js']
    }
  }
});
```

### Explanation
- `rollupOptions.external`: Specifies dependencies to exclude from the bundle. Vite will assume `collect.js` is available at runtime (e.g., installed in the client application).

2. **Rebuild the Library**:

```bash
cd lib
npm run build
```

3. Check the `lib/dist` folder:
   - The size of `dist/index.js` and `dist/index.umd.cjs` drops significantly (e.g., from ~60 KB to a few KB).
   - Open `dist/index.js`: It contains only the `pluckAndLog` function and an `import collect from 'collect.js'` statement, without the `collect.js` source code.

4. **Remove `collect.js` from the Library**:
   Since `collect.js` is now external, uninstall it from the `lib` project to confirm it’s not needed in the build:

```bash
npm uninstall collect.js
```

5. Rebuild the library:

```bash
npm run build
```

6. Relink the library:

```bash
npm link
cd ../app
npm link pluck
```

## Step 6: Testing the Optimized Library
Test the client application with the optimized library.

1. **Run the Client Application**:

```bash
cd app
npm run dev
```

2. **Unexpected Success**:
   - The browser console still shows `Pluck result: { items: ['Alice', 'Bob', 'Charlie'] }`.
   - This is because Vite’s cache (in `app/node_modules/.vite`) retains a cached version of `collect.js` from a previous run.

3. **Clear Vite’s Cache**:
   Remove the cache to simulate a clean environment:

```bash
cd app
rm -rf node_modules/.vite
```

4. Restart the development server:

```bash
npm run dev
```

5. **Expected Error**:
   The browser console shows an error like:
   ```
   Failed to resolve module specifier "collect.js". Relative references must start with either "/", "./", or "../".
   ```
   This occurs because `collect.js` is not installed in the `app` project or included in the `pluck` library’s bundle.

## Step 7: Installing `collect.js` in the Client Application
Since `collect.js` is an external dependency, the client application must install it.

1. Install `collect.js` in the `app` project:

```bash
cd app
npm install collect.js
```

2. **Re-run the Development Server**:

```bash
npm run dev
```

3. **Error Persists**:
   You may see an error like:
   ```
   Could not resolve 'pluck'
   ```
   This is because the `npm link pluck` command may have been disrupted by changes in the `node_modules` folder.

4. **Relink the Library**:
   Re-establish the link:

```bash
cd lib
npm link
cd ../app
npm link pluck
```

5. Restart the development server:

```bash
npm run dev
```

6. Open the browser and check the console:
   - Expected output: `Pluck result: { items: ['Alice', 'Bob', 'Charlie'] }`.
   - The `pluckAndLog` function now works because `collect.js` is installed in the `app` project.

## Step 8: Understanding the Setup
- **Why the Bundle Size Increased Initially**:
  - Without `rollupOptions.external`, Vite bundled the entire `collect.js` library (~60 KB) into `index.js` and `index.umd.cjs`.
- **Why Externalizing `collect.js` Helps**:
  - By listing `collect.js` in `rollupOptions.external`, Vite excludes it from the bundle, reducing the size of `index.js` and `index.umd.cjs`.
  - The client application must provide `collect.js` at runtime (via `npm install collect.js`).
- **Vite Cache Issue**:
  - Vite caches dependencies in `node_modules/.vite`, which can mask missing dependencies during development.
  - Clearing the cache (`rm -rf node_modules/.vite`) ensures a clean test environment.
- **npm link Challenges**:
  - Installing new dependencies or clearing caches can break `npm link` symlinks, requiring relinking.
- **Next Steps**:
  - The next lesson will cover publishing the `pluck` library to the npm registry and installing it in the `app` project as a regular dependency, avoiding `npm link`.

## Additional Notes
- **TypeScript Support**:
  - If using TypeScript, add type definitions for `collect.js` in the `app` project (e.g., via `@types/collect.js` if available) or declare them manually.
- **Publishing to npm**:
  - Ensure `collect.js` is listed as a `peerDependencies` or `dependencies` in `lib/package.json` if required by client applications:

```json
{
  "peerDependencies": {
    "collect.js": "^4.36.1"
  }
}
```

- **Best Practices**:
  - Externalize large third-party libraries to keep bundle sizes small.
  - Clearly document dependencies (e.g., `collect.js`) in your library’s README.
  - Test both development and production builds to catch cache-related issues.
- **Future Improvements**:
  - Consider tree-shaking `collect.js` if only specific methods (e.g., `pluck`) are needed, though this requires additional Rollup configuration.

This setup demonstrates how to integrate and externalize third-party libraries in a Vite npm package, ensuring efficient bundles and proper dependency management in client applications.