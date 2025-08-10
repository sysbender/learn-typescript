# Creating a Custom Vite Plugin for CSV Imports

This guide demonstrates how to create a custom Vite plugin to enable importing CSV files as JavaScript arrays. We’ll use the `csv-parse` library to parse CSV data and the `vite-plugin-inspect` plugin to debug transformations. The plugin will transform CSV files into valid ES modules during the build process.

## Prerequisites
- A Vite project set up with JavaScript (vanilla template).
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.
- Basic familiarity with Vite configuration and plugins.

## Step 1: Setting Up the Project
We’ll prepare a Vite project to import a CSV file and display its contents.

1. **Create a Vite Project** (if not already set up):

```bash
npm create vite@latest csv-plugin-demo -- --template vanilla
cd csv-plugin-demo
npm install
```

2. **Add a CSV File**:
   Create `products.csv` in the project root with sample data:

```csv
name,quantity
Laptop,10
Phone,25
Tablet,15
```

3. **Update `index.html`**:
   Add a `<pre>` element to display the CSV data:

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

   - The `white-space: pre-wrap` style ensures the output is formatted across multiple lines.

4. **Update `src/main.js`**:
   Import the CSV file and display its contents in the `<pre>` element:

```javascript
import products from '../products.csv';

const output = document.getElementById('output');
output.textContent = JSON.stringify(products, null, 2);
```

   - `JSON.stringify(products, null, 2)` formats the array for readable output.
   - This will fail initially because Vite doesn’t natively support CSV imports.

5. **Test the Development Server**:
   Start the server:

```bash
npm run dev
```

   Open the browser (usually at `http://localhost:5173`). You’ll see an error like:
   ```
   Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/csv".
   ```
   This occurs because Vite doesn’t know how to handle `.csv` files as modules.

## Step 2: Installing the Inspect Plugin
Use `vite-plugin-inspect` to debug module transformations.

1. **Install the Plugin**:

```bash
npm install vite-plugin-inspect --save-dev
```

2. **Create `vite.config.js`** (if not already present):

```javascript
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [Inspect()]
});
```

3. **Restart the Development Server**:

```bash
npm run dev
```

4. Open the inspect URL (shown in the terminal, e.g., `http://localhost:5173/__inspect/`):
   - Confirm the inspector page loads, showing module transformations.
   - The `products.csv` module will still fail due to the missing CSV plugin.

## Step 3: Installing the CSV Parser
We’ll use the `csv-parse/sync` module from the `csv-parse` library to parse CSV files.

1. **Install the Library**:

```bash
npm install csv-parse
```

## Step 4: Creating the Custom CSV Plugin
Create a Vite plugin to transform `.csv` files into ES modules.

1. **Update `vite.config.js`**:
   Add a custom plugin named `vite-plugin-csv` to parse CSV files:

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

### Explanation
- **Plugin Object**:
  - `name: 'vite-plugin-csv'`: Identifies the plugin in Vite’s pipeline (visible in the inspect UI).
  - `transform(source, id)`: A synchronous hook called for every imported module.
    - `source`: The file’s content (raw CSV data for `.csv` files).
    - `id`: The file’s path.
- **Conditional Check**:
  - `/\.csv$/.test(id)`: Ensures the plugin only processes `.csv` files.
- **CSV Parsing**:
  - `parse(source, { columns: true })`: Parses the CSV content into an array of objects, using the first row as column names.
- **Output**:
  - `return { code: `export default ${JSON.stringify(records)}` }`: Returns an ES module that exports the parsed array.
- **Debugging**:
  - `console.log` statements output the `source`, `id`, and `records` to the server console for debugging.

## Step 5: Testing the Plugin
Test the CSV import in the development environment.

1. **Restart the Development Server**:

```bash
npm run dev
```

2. Open the browser (e.g., `http://localhost:5173`):
   - The `<pre>` element should display:
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
   - The CSV file is successfully transformed into a JavaScript array and displayed.

3. **Check the Server Console**:
   - Refresh the browser and check the terminal running `npm run dev`. You should see:
     ```
     Source: name,quantity
     Laptop,10
     Phone,25
     Tablet,15
     ID: /path/to/csv-plugin-demo/products.csv
     Records: [
       { name: 'Laptop', quantity: '10' },
       { name: 'Phone', quantity: '25' },
       { name: 'Tablet', quantity: '15' }
     ]
     ```

4. **Inspect Transformations**:
   Open the inspect URL (e.g., `http://localhost:5173/__inspect/`):
   - Click on `products.csv` in the module list.
   - You’ll see a transformation labeled `vite-plugin-csv` that converts the raw CSV into:
     ```javascript
     export default [{"name":"Laptop","quantity":"10"},{"name":"Phone","quantity":"25"},{"name":"Tablet","quantity":"15"}]
     ```

5. **Verify Network Response**:
   - In the browser’s developer tools (Network tab), select the request for `products.csv`.
   - The response is a valid ES module (e.g., `export default [...]`), not raw CSV.

## Step 6: Testing the Production Build
Ensure the plugin works in a production build.

1. **Build the Project**:

```bash
npm run build
```

2. **Preview the Build**:

```bash
npm run preview
```

3. Open the preview URL (e.g., `http://localhost:4173`):
   - The `<pre>` element should display the same array as in development.
   - The plugin correctly transforms the CSV file in the production build.

## Step 7: Understanding the Plugin
- **How It Works**:
  - The `transform` hook intercepts `.csv` imports, parses the content using `csv-parse/sync`, and returns an ES module.
  - The `columns: true` option tells `csv-parse` to use the first row as column names, producing an array of objects.
- **Why Conditional Check?**:
  - The `/\.csv$/.test(id)` ensures the plugin only processes `.csv` files, avoiding unnecessary transformations for other file types (e.g., `.js`, `.css`).
- **Debugging with `vite-plugin-inspect`**:
  - The inspect plugin visualizes the transformation pipeline, showing how `vite-plugin-csv` converts raw CSV into an ES module.
- **Why `JSON.stringify`?**:
  - The parsed records are converted to a stringified JSON array to create a valid ES module export.

## Additional Notes
- **TypeScript Support**:
  - For TypeScript projects, define types for the CSV data in a `.d.ts` file:
    ```typescript
    declare module '*.csv' {
      const content: Array<{ [key: string]: string }>;
      export default content;
    }
    ```
- **Plugin Enhancements**:
  - Add options to the plugin for customizable parsing (e.g., delimiter, encoding):
    ```javascript
    {
      name: 'vite-plugin-csv',
      transform(source, id) {
        if (/\.csv$/.test(id)) {
          const records = parse(source, { columns: true, delimiter: ',' });
          return { code: `export default ${JSON.stringify(records)}` };
        }
      }
    }
    ```
- **Other CSV Libraries**:
  - Alternatives like `papaparse` can be used instead of `csv-parse` for different parsing needs.
- **Best Practices**:
  - Log debug information during development to troubleshoot transformations.
  - Test edge cases (e.g., empty CSV files, missing headers).
  - Use `vite-plugin-inspect` during development to verify plugin behavior.
- **Production Considerations**:
  - The plugin works in both development and production, but test production builds to ensure consistent output.
- **Publishing the Plugin**:
  - To share the plugin, create a separate npm package and publish it (similar to Lesson 22).

This setup demonstrates how to create a custom Vite plugin to enable CSV file imports as ES modules, using `csv-parse` for transformation and `vite-plugin-inspect` for debugging.