# Creating and Using an npm Package with Vite

This guide explains how to use Vite to create an npm package (library) and integrate it into a client application without publishing it to the npm registry. We'll create a simple utility library, configure Vite to build it as a package, and link it to a client application for testing.

## Prerequisites
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.
- Familiarity with Vite project setup.

## Step 1: Setting Up the Projects
We'll create two Vite projects: one for the library (`lib`) and one for the client application (`app`).

1. **Create a Parent Folder**:
   Create a folder named `18` to hold both projects.

```bash
mkdir 18
cd 18
```

2. **Create the Client Application**:
   Scaffold a Vite project for the client application.

```bash
npm create vite@latest app -- --template vanilla
cd app
npm install
cd ..
```

3. **Create the Library Project**:
   Scaffold another Vite project for the library.

```bash
npm create vite@latest lib -- --template vanilla
cd lib
npm install
```

4. **Test the Library Project**:
   - Start the development server for the `lib` project:

```bash
cd lib
npm run dev
```

   - Open the browser (usually at `http://localhost:5173`) to confirm the default Vite app loads correctly.

## Step 2: Creating the Library
We'll create a simple utility function in the library project and configure it as an npm package.

1. **Clear `src/main.js`**:
   Open `lib/src/main.js` and remove its contents (we’ll use it for testing later).

2. **Create the Library File**:
   Create `lib/src/index.js` to define the library’s functionality. We’ll implement a `pluck` function that extracts values of a specified key from an array of objects.

```javascript
export function pluck(array, key) {
  return array.map(item => item[key]);
}
```

3. **Test the Function (Temporary)**:
   For testing, add sample code to `lib/src/main.js`:

```javascript
import { pluck } from './index.js';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

console.log(pluck(users, 'name')); // Expected: ['Alice', 'Bob', 'Charlie']
```

4. **Update `lib/index.html`**:
   Ensure `lib/index.html` references `main.js`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Library Test</title>
</head>
<body>
  <h1>Library Test</h1>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

5. **Run the Development Server**:
   Start the `lib` project’s dev server:

```bash
cd lib
npm run dev
```

6. Open the browser and check the console. You should see `['Alice', 'Bob', 'Charlie']`.

7. **Comment Out Test Code**:
   Since this is a library, comment out the test code in `lib/src/main.js` to avoid including it in the final package:

```javascript
// import { pluck } from './index.js';
//
// const users = [
//   { name: 'Alice', age: 25 },
//   { name: 'Bob', age: 30 },
//   { name: 'Charlie', age: 35 }
// ];
//
// console.log(pluck(users, 'name'));
```

## Step 3: Configuring Vite for Library Mode
Configure Vite to build the project as an npm package.

1. Create `lib/vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'Pluck',
      fileName: 'pluck'
    }
  }
});
```

### Explanation
- `build.lib`: Informs Vite to build the project as a library.
- `entry`: Points to the main file (`src/index.js`) containing the library’s code.
- `name`: The global name for UMD builds (e.g., `Pluck` for `window.Pluck`).
- `fileName`: The base name for the output files (e.g., `pluck.js`, `pluck.umd.cjs`).

2. **Build the Library**:
   Run the build command in the `lib` project:

```bash
cd lib
npm run build
```

3. Check the `lib/dist` folder:
   - Vite generates two files:
     - `dist/pluck.js`: For ES module imports (`import { pluck } from 'pluck'`).
     - `dist/pluck.umd.cjs`: For CommonJS/UMD imports (`require('pluck')`).
   - Open `dist/pluck.js` to see the minified `pluck` function exported as an ES module.
   - Open `dist/pluck.umd.cjs` to see the UMD version for CommonJS/require.

## Step 4: Configuring `package.json` for the Library
Update `lib/package.json` to make the library importable.

1. Open `lib/package.json` and modify it:

```json
{
  "name": "pluck",
  "version": "1.0.0",
  "main": "./dist/pluck.umd.cjs",
  "module": "./dist/pluck.js",
  "exports": {
    "import": "./dist/pluck.js",
    "require": "./dist/pluck.umd.cjs"
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
- `name`: The package name (`pluck`) used when importing.
- `main`: Path to the CommonJS/UMD build (`dist/pluck.umd.cjs`).
- `module`: Path to the ES module build (`dist/pluck.js`).
- `exports`: Specifies entry points for ES modules (`import`) and CommonJS (`require`).

## Step 5: Linking the Library to the Client Application
Use `npm link` to make the library available to the client application without publishing it to npm.

1. **Make the Library Globally Available**:
   In the `lib` project, run:

```bash
cd lib
npm link
```

   This creates a global symlink for the `pluck` package.

2. **Link the Library in the Client Application**:
   In the `app` project, link the library:

```bash
cd ../app
npm link pluck
```

3. Check the `app/node_modules` folder:
   - A `pluck` symlink is created, pointing to the `lib` project’s source code.

## Step 6: Using the Library in the Client Application
Test the library by importing and using the `pluck` function in the client application.

1. **Clear and Update `app/src/main.js`**:
   Replace the contents of `app/src/main.js` with:

```javascript
import { pluck } from 'pluck';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

console.log(pluck(users, 'name')); // Expected: ['Alice', 'Bob', 'Charlie']
```

2. **Update `app/index.html`**:
   Add a heading for clarity:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Client App</title>
</head>
<body>
  <h1>Client Application</h1>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

3. **Run the Client Application**:
   Start the development server for the `app` project:

```bash
cd app
npm run dev
```

4. Open the browser and check the console. You should see `['Alice', 'Bob', 'Charlie']`, confirming the `pluck` function works.

## Step 7: Understanding the Setup
- **Library Project (`lib`)**:
  - `src/index.js`: Contains the `pluck` function, the core of the library.
  - `vite.config.js`: Configures Vite to build the project as a library with `build.lib`.
  - `package.json`: Specifies the package name and entry points for ES modules and CommonJS.
  - `npm link`: Makes the library globally available for local testing.

- **Client Application (`app`)**:
  - Imports the `pluck` function from the `pluck` package.
  - Uses `npm link pluck` to reference the library’s source code via a symlink.

- **Why Two Builds?**:
  - `pluck.js`: For modern ES module imports, used in Vite and other module bundlers.
  - `pluck.umd.cjs`: For CommonJS/UMD compatibility, used in Node.js or older environments.

## Additional Notes
- **Publishing to npm**: This guide uses `npm link` for local testing. To publish the library to npm, run `npm publish` in the `lib` project after ensuring `package.json` is correctly configured (covered in a future lesson).
- **TypeScript Support**: If using TypeScript, add type definitions in `lib/src/index.d.ts` and include `"types": "./dist/index.d.ts"` in `package.json`.
- **Best Practices**:
  - Keep the library lightweight and focused on specific functionality.
  - Use meaningful package names and version numbers.
  - Test the library thoroughly in the client application before publishing.
- **Extending the Library**: Add more functions to `lib/src/index.js` and export them as needed.

This setup demonstrates how to create, build, and test an npm package using Vite, making it reusable in client applications via local linking.