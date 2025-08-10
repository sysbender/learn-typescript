# Publishing a Vite npm Package to the npm Registry

This guide covers the process of publishing a Vite-built npm package to the npm registry, ensuring it works correctly in a client application. We’ll update the library to include a third-party dependency (`collect.js`), configure it properly, and test both development and production builds in the client application. This builds on the previous lesson, where we integrated `collect.js` as an external dependency.

## Prerequisites
- A Vite library project (`lib`) and a client application (`app`) set up as described in previous lessons.
- The `lib` project contains:
  - `src/index.js`: Exports the `pluckAndLog` function using `collect.js`.
  - `src/log.js`: Exports the `log` function.
  - `vite.config.js`: Configured for multiple entry points and externalizes `collect.js`.
  - `package.json`: Defines entry points for ES and CommonJS modules.
- The `app` project imports `pluckAndLog` from the `pluck` library.
- An npm account (registered at [npmjs.com](https://www.npmjs.com)).
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.

## Step 1: Reviewing the Current Setup
The `app` project uses the `pluck` library, linked locally via `npm link`:

**`app/src/main.js`**:
```javascript
import { pluckAndLog } from 'pluck';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

pluckAndLog(users, 'name'); // Logs: Pluck result: { items: ['Alice', 'Bob', 'Charlie'] }
```

The `lib` project is configured as follows:

**`lib/src/index.js`**:
```javascript
import collect from 'collect.js';

export function pluckAndLog(array, key) {
  const result = collect(array).pluck(key).all();
  console.log('Pluck result:', result);
  return result;
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
    },
    rollupOptions: {
      external: ['collect.js']
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

The `app/node_modules/pluck` folder is a symlink to the `lib` project, created via `npm link pluck`.

## Step 2: Preparing the Library for Publishing
To publish the library to the npm registry, we need to make several updates.

1. **Update the Package Name**:
   To avoid naming conflicts (e.g., `pluck` may already exist on npm), use a scoped package name matching your npm username.

   Open `lib/package.json` and update the `name` field:
   ```json
   "name": "@your-username/pluck",
   ```

   Replace `@your-username` with your actual npm username.

2. **Remove the `private` Field**:
   If `package.json` contains `"private": true`, remove it to allow publishing:

   ```json
   {
     "name": "@your-username/pluck",
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

3. **Specify Files to Publish**:
   Add a `files` field to `lib/package.json` to include only the `dist` folder in the published package:

   ```json
   {
     "name": "@your-username/pluck",
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
     "files": ["dist"],
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

4. **Add Peer Dependencies**:
   Since `collect.js` is externalized (`rollupOptions.external`), list it as a `peerDependencies` to indicate that client applications must install it:

   ```json
   {
     "name": "@your-username/pluck",
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
     "files": ["dist"],
     "peerDependencies": {
       "collect.js": "^4.36.1"
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

## Step 3: Publishing the Library
Publish the library to the npm registry.

1. **Log in to npm**:
   In the `lib` project, run:

```bash
cd lib
npm login
```

   - Enter your npm username, password, and email.
   - If two-factor authentication is enabled, check your email for a code and enter it.
   - Confirm successful authentication with a message like `Logged in as @your-username`.

2. **Build the Library**:
   Ensure the latest build is ready:

```bash
npm run build
```

3. **Publish to npm**:
   Publish the library as a public package:

```bash
npm publish --access public
```

   - The `--access public` flag is required for scoped packages (e.g., `@your-username/pluck`) to make them publicly accessible.
   - If you see an error about private packages requiring a paid account, ensure the `private` field is removed and `--access public` is included.

4. Verify the package on [npmjs.com](https://www.npmjs.com). You should see `@your-username/pluck` listed under your account.

## Step 4: Updating the Client Application
Remove the local link and install the published package in the `app` project.

1. **Remove Existing Dependencies**:
   In the `app` project, remove `collect.js`, the Vite cache, and the `pluck` symlink:

```bash
cd app
npm uninstall collect.js
rm -rf node_modules/.vite
rm -rf node_modules/pluck
```

2. **Update `app/src/main.js`**:
   Update the import to use the scoped package name:

```javascript
import { pluckAndLog } from '@your-username/pluck';

const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

pluckAndLog(users, 'name'); // Logs: Pluck result: { items: ['Alice', 'Bob', 'Charlie'] }
```

3. **Install the Published Package**:
   Install the library and its peer dependency (`collect.js`):

```bash
npm install @your-username/pluck
```

   - This automatically installs `collect.js` as a peer dependency, as specified in `lib/package.json`.

4. **Check `app/node_modules`**:
   - Confirm that `@your-username/pluck` is installed with a `dist` folder containing `index.js`, `index.umd.cjs`, `log.js`, and `log.umd.cjs`.
   - Verify that `collect.js` is installed in `app/node_modules`.

5. **Run the Development Server**:

```bash
npm run dev
```

6. Open the browser (usually at `http://localhost:5173`) and check the console:
   - Expected output: `Pluck result: { items: ['Alice', 'Bob', 'Charlie'] }`.

## Step 5: Testing the Production Build
Ensure the library works in a production build.

1. Build the client application:

```bash
npm run build
```

2. Preview the production build:

```bash
npm run preview
```

3. Open the preview URL (e.g., `http://localhost:4173`) and check the console:
   - Expected output: `Pluck result: { items: ['Alice', 'Bob', 'Charlie'] }`.
   - The build succeeds, confirming that the library and its peer dependency work correctly.

## Step 6: Updating and Republishing the Library
If you make changes to the library, update the version and republish.

1. **Update the Library Version**:
   In the `lib` project, increment the patch version:

```bash
cd lib
npm version patch
```

   - This updates `package.json` (e.g., from `1.0.0` to `1.0.1`).

2. **Rebuild and Republish**:

```bash
npm run build
npm publish --access public
```

3. **Update the Client Application**:
   In the `app` project, remove the old version and reinstall:

```bash
cd app
rm -rf node_modules/@your-username
npm install @your-username/pluck
```

4. **Retest**:
   Run `npm run dev` and `npm run build` + `npm run preview` to confirm the updated library works.

## Step 7: Understanding the Setup
- **Why Scoped Packages?**:
  - Using `@your-username/pluck` avoids naming conflicts with existing npm packages.
- **Why `files` Field?**:
  - The `files: ["dist"]` field ensures only the `dist` folder (with built assets) is published, reducing package size.
- **Why `peerDependencies`?**:
  - Listing `collect.js` as a peer dependency ensures it’s installed by client applications, not bundled in the library.
- **Why `--access public`?**:
  - Scoped packages require the `--access public` flag to be publicly accessible on npm.
- **Replacing `npm link`**:
  - Installing the package via `npm install @your-username/pluck` eliminates the need for local linking, simplifying dependency management.

## Additional Notes
- **TypeScript Support**:
  - Add type definitions (e.g., `lib/src/index.d.ts`) and include `"types": "./dist/index.d.ts"` in `lib/package.json` if using TypeScript.
- **Best Practices**:
  - Use scoped package names for uniqueness.
  - Specify `peerDependencies` for external libraries to keep bundles small.
  - Test both development and production builds after publishing.
  - Document peer dependencies in your library’s README.
- **Versioning**:
  - Use `npm version patch` for bug fixes, `minor` for new features, or `major` for breaking changes.
- **Troubleshooting**:
  - If you encounter errors about missing dependencies, ensure `peerDependencies` are correctly specified and installed.
  - Clear Vite’s cache (`rm -rf node_modules/.vite`) to avoid stale dependency issues.

This setup successfully publishes a Vite library to the npm registry, integrates a third-party dependency (`collect.js`), and ensures it works in both development and production environments in a client application.