# Refactoring and Enhancing a Custom Vite Plugin for CSV Imports

This guide builds on the previous lesson, where we created a Vite plugin (`vite-plugin-csv`) to import CSV files as JavaScript arrays. Here, we’ll refactor the plugin into a separate module, explore additional Vite plugin hooks (`apply`, `configResolved`, `transformIndexHtml`), and configure the plugin to behave differently in development and production environments. We’ll also review the Vite plugin ecosystem and use `vite-plugin-inspect` for debugging.

## Prerequisites
- A Vite project set up as described in the previous lesson, with:
  - `products.csv`: A sample CSV file.
  - `index.html`: Displays CSV data in a `<pre>` element.
  - `src/main.js`: Imports `products.csv` and displays its contents.
  - `vite.config.js`: Includes `vite-plugin-inspect` and the inline CSV plugin.
  - `csv-parse` installed for parsing CSV files.
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.

## Step 1: Reviewing the Current Setup
The current project imports a CSV file and displays its contents:

**`products.csv`**:
```csv
name,quantity
Laptop,10
Phone,25
Tablet,15
```

**`index.html`**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSV Plugin Demo</title>
  <style>
    pre { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>CSV Import Demo</h1>
  <pre id="output"></pre>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**`src/main.js`**:
```javascript
import products from '../products.csv';

const output = document.getElementById('output');
output.textContent = JSON.stringify(products, null, 2);
```

**`vite.config.js`**:
```javascript
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import { parse } from 'csv-parse/sync';

export default defineConfig({
  plugins: [
    Inspect(),
    {
      name: 'vite-plugin-csv',
      transform(source, id) {
        if (/\.csv$/.test(id)) {
          console.log('Source:', source);
          console.log('ID:', id);
          const records = parse(source, { columns: true });
          console.log('Records:', records);
          return {
            code: `export default ${JSON.stringify(records)}`
          };
        }
      }
    }
  ]
});
```

Running `npm run dev` displays the CSV data as an array of objects in the browser:
```json
[
  {
    "name": "Laptop",
    "quantity": "10"
  },
  {
    "name": "Phone",
    "quantity": "25"
  },
  {
    "name": "Tablet",
    "quantity": "15"
  }
]
```

## Step 2: Refactoring the Plugin into a Separate Module
Move the inline CSV plugin into a separate file as a factory function, similar to `vite-plugin-inspect`.

1. **Create `vite-plugin-csv.js`**:
   In the project root, create `vite-plugin-csv.js`:

```javascript
import { parse } from 'csv-parse/sync';

export function csv() {
  return {
    name: 'csv',
    transform(source, id) {
      if (/\.csv$/.test(id)) {
        console.log('Source:', source);
        console.log('ID:', id);
        const records = parse(source, { columns: true });
        console.log('Records:', records);
        return {
          code: `export default ${JSON.stringify(records)}`
        };
      }
    }
  };
}
```

### Explanation
- **Factory Function**:
  - The `csv` function returns the plugin object, making it reusable and modular.
  - The plugin name is simplified to `csv` for clarity.
- **Async Removal**:
  - Since `csv-parse/sync` is synchronous, the `transform` hook doesn’t need to be async, so the `async` keyword is removed.
- **Import**:
  - The `parse` function is imported from `csv-parse/sync` within the plugin file.

2. **Update `vite.config.js`**:
   Import and use the `csv` plugin:

```javascript
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import { csv } from './vite-plugin-csv';

export default defineConfig({
  plugins: [
    Inspect(),
    csv()
  ]
});
```

3. **Test the Refactored Plugin**:
   Start the development server:

```bash
npm run dev
```

4. Open the browser (e.g., `http://localhost:5173`):
   - The output should be identical to before, confirming the refactored plugin works.
   - Check the server console for debug logs (`Source`, `ID`, `Records`).

5. **Inspect Transformations**:
   Open the inspect URL (e.g., `http://localhost:5173/__inspect/`):
   - The `products.csv` module shows a transformation labeled `csv`, indicating the plugin is applied correctly.

## Step 3: Exploring the Vite Plugin Ecosystem
Before enhancing the plugin, let’s review available Vite plugins:

- **Official Vite Plugins**:
  - Listed in the [Vite documentation](https://vite.dev/guide/using-plugins.html#official-plugins).
  - Examples include `vite-plugin-vue` for Vue.js or `vite-plugin-react` for React.
- **Rollup Plugins**:
  - Vite uses Rollup for production builds, so many Rollup plugins are compatible.
  - Find compatible plugins at [Rollup’s awesome list](https://github.com/rollup/awesome) or the Vite documentation.
- **Community Plugins**:
  - The [Awesome Vite repository](https://github.com/vitejs/awesome-vite) lists community plugins and resources.
  - Examples include plugins for image optimization, TypeScript enhancements, and more.

## Step 4: Adding the `apply` Option
Use the `apply` option to control when the plugin is active (development or production).

1. **Restrict to Development**:
   Update `vite-plugin-csv.js` to apply only during development:

```javascript
import { parse } from 'csv-parse/sync';

export function csv() {
  return {
    name: 'csv',
    apply: 'serve',
    transform(source, id) {
      if (/\.csv$/.test(id)) {
        console.log('Source:', source);
        console.log('ID:', id);
        const records = parse(source, { columns: true });
        console.log('Records:', records);
        return {
          code: `export default ${JSON.stringify(records)}`
        };
      }
    }
  };
}
```

2. **Test Development**:
   Run the development server:

```bash
npm run dev
```

   The CSV import works as expected.

3. **Test Production**:
   Build the project:

```bash
npm run build
```

   You’ll see an error like:
   ```
   Failed to resolve import "../products.csv" from "src/main.js". Does the file exist?
   ```
   This occurs because the `csv` plugin is not applied during production (`apply: 'serve'`).

4. **Switch to Production**:
   Change `apply` to `'build'`:

```javascript
apply: 'build'
```

5. **Test Again**:
   - Run `npm run dev`: The CSV import fails with an error like `Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/csv"`.
   - Run `npm run build` and `npm run preview`: The CSV import works, confirming the plugin is active only in production.

6. **Use a Function for `apply`**:
   For finer control, use a function:

```javascript
import { parse } from 'csv-parse/sync';

export function csv() {
  return {
    name: 'csv',
    apply(config, { command, mode }) {
      console.log('Config:', config);
      console.log('Command:', command);
      console.log('Mode:', mode);
      return mode === 'development';
    },
    transform(source, id) {
      if (/\.csv$/.test(id)) {
        console.log('Source:', source);
        console.log('ID:', id);
        const records = parse(source, { columns: true });
        console.log('Records:', records);
        return {
          code: `export default ${JSON.stringify(records)}`
        };
      }
    }
  };
}
```

7. **Test the Function**:
   - Run `npm run dev`:
     - Server console logs:
       ```
       Config: { ... } // Vite config object
       Command: serve
       Mode: development
       ```
     - The plugin is active (`mode === 'development'`), and the CSV import works.
   - Run `npm run build`:
     - The plugin is inactive, causing a build error for the CSV import.

## Step 5: Accessing Configuration with `configResolved`
Store the resolved Vite configuration for use in other hooks.

1. **Update `vite-plugin-csv.js`**:
   Add a `configResolved` hook to store the configuration and use it in `transform`:

```javascript
import { parse } from 'csv-parse/sync';

export function csv() {
  let config;
  return {
    name: 'csv',
    apply(configObj, { command, mode }) {
      console.log('Config:', configObj);
      console.log('Command:', command);
      console.log('Mode:', mode);
      return mode === 'development';
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transform(source, id) {
      if (/\.csv$/.test(id)) {
        console.log('Source:', source);
        console.log('ID:', id);
        const records = parse(source, { columns: config.command === 'serve' });
        console.log('Records:', records);
        return {
          code: `export default ${JSON.stringify(records)}`
        };
      }
    }
  };
}
```

### Explanation
- **Closure Variable**:
  - `let config` stores the resolved configuration.
- **configResolved Hook**:
  - Called before `transform`, it receives the resolved Vite configuration and assigns it to `config`.
- **Dynamic Parsing**:
  - The `columns` option for `parse` is set based on `config.command === 'serve'`.
  - In development (`serve`), `columns: true` produces an array of objects.
  - In production (`build`), `columns: false` produces an array with the header row as the first element.

2. **Test Development**:
   Run `npm run dev`:
   - Output in the browser:
     ```json
     [
       {
         "name": "Laptop",
         "quantity": "10"
       },
       {
         "name": "Phone",
         "quantity": "25"
       },
       {
         "name": "Tablet",
         "quantity": "15"
       }
     ]
     ```

3. **Test Production**:
   Update `apply` to include production:

```javascript
apply(configObj, { command, mode }) {
  return true; // Apply in both development and production
}
```

   Run `npm run build` and `npm run preview`:
   - Output in the browser:
     ```json
     [
       ["name", "quantity"],
       ["Laptop", "10"],
       ["Phone", "25"],
       ["Tablet", "15"]
     ]
     ```
   - The first element is the header row, as `columns: false` is used in production.

## Step 6: Adding the `transformIndexHtml` Hook
Add a hook to modify the HTML content.

1. **Update `vite-plugin-csv.js`**:
   Add a `transformIndexHtml` hook to inject a script:

```javascript
import { parse } from 'csv-parse/sync';

export function csv() {
  let config;
  return {
    name: 'csv',
    apply(configObj, { command, mode }) {
      console.log('Config:', configObj);
      console.log('Command:', command);
      console.log('Mode:', mode);
      return true;
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transform(source, id) {
      if (/\.csv$/.test(id)) {
        console.log('Source:', source);
        console.log('ID:', id);
        const records = parse(source, { columns: config.command === 'serve' });
        console.log('Records:', records);
        return {
          code: `export default ${JSON.stringify(records)}`
        };
      }
    },
    transformIndexHtml(html) {
      return html.replace('</body>', '<script>alert("Hello");</script></body>');
    }
  };
}
```

2. **Test the Hook**:
   Run `npm run dev`:
   - The browser displays an alert with “Hello” before showing the page.
   - Check the page source: A `<script>alert("Hello");</script>` is added before `</body>`.

3. **Production Test**:
   Run `npm run build` and `npm run preview`:
   - The alert and modified HTML are present, confirming the hook works in production.

## Step 7: Understanding the Enhancements
- **Factory Function**:
  - Moving the plugin to `vite-plugin-csv.js` makes it modular and reusable, similar to `vite-plugin-inspect`.
- **apply Option**:
  - Controls when the plugin is active (`serve`, `build`, or a custom function).
  - The function form provides access to `config`, `command`, and `mode` for fine-grained control.
- **configResolved Hook**:
  - Stores the resolved Vite configuration for use in other hooks, enabling dynamic behavior (e.g., different CSV parsing in development vs. production).
- **transformIndexHtml Hook**:
  - Modifies HTML content, useful for injecting scripts, meta tags, or other elements.
- **Vite Plugin Ecosystem**:
  - Official plugins, Rollup-compatible plugins, and community plugins (e.g., from Awesome Vite) provide extensive functionality.
  - Check [Vite documentation](https://vite.dev/guide/api-plugin.html) for more hooks (e.g., `load`, `resolveId`).

## Additional Notes
- **TypeScript Support**:
  - For TypeScript, add a declaration file:
    ```typescript
    declare module '*.csv' {
      const content: Array<{ [key: string]: string }>;
      export default content;
    }
    ```
- **Publishing the Plugin**:
  - Move `vite-plugin-csv.js` to a separate npm package, add a `package.json`, and publish it (see Lesson 22).
- **Best Practices**:
  - Use descriptive plugin names (e.g., `csv` or `vite-plugin-csv`).
  - Test plugins in both development and production to ensure consistent behavior.
  - Document configuration options and dependencies in a README.
- **Debugging**:
  - Use `vite-plugin-inspect` to visualize transformations.
  - Log debug information in hooks to troubleshoot issues.
- **Further Hooks**:
  - Explore other hooks like `load`, `resolveId`, or `buildStart` in the [Vite plugin API documentation](https://vite.dev/guide/api-plugin.html).

This setup refactors the CSV plugin into a modular factory function, adds conditional application, uses configuration dynamically, and enhances HTML output, demonstrating the flexibility of Vite’s plugin system.