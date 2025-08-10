# Working with Environment Variables in Vite Projects

This guide explains how to use environment variables in Vite projects, including defining custom variables, handling different build modes, and accessing them in JavaScript and HTML files. Environment variables allow you to configure your application dynamically based on the environment (e.g., development, production, or custom modes).

## Prerequisites
- A Vite project set up with JavaScript or TypeScript.
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.

## Step 1: Accessing Default Environment Variables
Vite exposes environment variables to client-side code via the `import.meta.env` object. Let’s explore this by logging the object.

1. Clear the contents of `src/main.js`.
2. Add the following code to log the `import.meta.env` object:

```javascript
console.log(import.meta.env);
```

3. Run the Vite development server:

```bash
npm run dev
```

4. Open your browser’s developer console (usually at `http://localhost:5173`) and inspect the output.

### Expected Output
The `import.meta.env` object contains default environment variables, such as:
- `import.meta.env.MODE`: The mode Vite is running in (e.g., `development` for `npm run dev`).
- `import.meta.env.PROD`: `false` in development mode.
- `import.meta.env.DEV`: `true` in development mode.

5. Build the project for production:

```bash
npm run build
```

6. Preview the production build:

```bash
npm run preview
```

7. Open the preview URL in the browser and check the console again. Now, `import.meta.env.MODE` is `production`, and `import.meta.env.PROD` is `true`.

## Step 2: Defining Custom Environment Variables
To define custom environment variables, create a `.env` file in the project root.

1. Create a file named `.env` in the root of your project.
2. Add the following environment variables:

```plaintext
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MyViteApp
```

### Important Notes
- **Prefix Requirement**: Environment variables must start with the `VITE_` prefix (or a custom prefix) to be included in the client-side bundle. This prevents accidental exposure of sensitive data (e.g., database passwords).
- Without the `VITE_` prefix, variables are not included in `import.meta.env`.

3. To demonstrate, add a variable without the prefix in `.env`:

```plaintext
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MyViteApp
SECRET=hidden_value
```

4. Restart the development server:

```bash
npm run dev
```

5. Check the browser console. The `SECRET` variable will not appear in `import.meta.env`, but `VITE_API_URL` and `VITE_APP_NAME` will.

## Step 3: Overriding the Default Prefix
You can customize the environment variable prefix in the Vite configuration.

1. Open `vite.config.js` and add the `envPrefix` option:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: 'APP_',
});
```

2. Update the `.env` file to use the new prefix:

```plaintext
APP_API_URL=https://api.example.com
APP_APP_NAME=MyViteApp
```

3. Restart the development server:

```bash
npm run dev
```

4. Check the browser console. The variables `APP_API_URL` and `APP_APP_NAME` should now appear in `import.meta.env`, while the old `VITE_` variables are no longer available.

## Step 4: Mode-Specific Environment Variables
Vite supports mode-specific environment files (e.g., `.env.development`, `.env.production`) to define variables for specific environments.

1. Create a `.env.production` file for production mode:

```plaintext
APP_API_URL=https://prod-api.example.com
APP_APP_NAME=MyViteAppProd
```

2. Build the project in production mode:

```bash
npm run build
```

3. Preview the production build:

```bash
npm run preview
```

4. Open the browser console. The `import.meta.env` object should reflect the values from `.env.production` (e.g., `APP_API_URL=https://prod-api.example.com`).

5. Switch back to the development server (`npm run dev`). The console will show values from the `.env` file, as development mode is active.

## Step 5: Custom Build Modes
You can define custom modes (e.g., `staging`) with their own environment files.

1. Create a `.env.staging` file:

```plaintext
APP_API_URL=https://staging-api.example.com
APP_APP_NAME=MyViteAppStaging
```

2. Build the project with the custom `staging` mode:

```bash
npm run build -- --mode staging
```

3. Preview the staging build:

```bash
npm run preview
```

4. Open the browser console. The `import.meta.env` object should show values from `.env.staging` (e.g., `APP_API_URL=https://staging-api.example.com`).

### Explanation
- The `--mode staging` flag tells Vite to load `.env.staging` during the build.
- Vite supports any custom mode by creating a corresponding `.env.[mode]` file.

## Step 6: Using Environment Variables in HTML
You can also access environment variables in HTML files using Vite’s `%VARIABLE_NAME%` syntax (with the appropriate prefix).

1. Update `index.html` to display the `APP_API_URL` variable:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite Environment Variables</title>
</head>
<body>
  <p>API URL: %APP_API_URL%</p>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

2. Run the development server:

```bash
npm run dev
```

3. Open the browser. The page should display `API URL: https://api.example.com` (from `.env`).

4. Build and preview in production mode:

```bash
npm run build
npm run preview
```

5. The page should now display `API URL: https://prod-api.example.com` (from `.env.production`).

## Step 7: Overriding Environment Variables via CLI
You can override environment variables directly in the command line, which takes precedence over `.env` files.

1. Start the development server with a custom `APP_API_URL`:

```bash
APP_API_URL=https://cli-override.example.com npm run dev
```

2. Open the browser console and inspect `import.meta.env.APP_API_URL`. It should show `https://cli-override.example.com`, overriding the value from the `.env` file.

## Step 8: How Vite Processes Environment Variables
- Vite transforms references to `import.meta.env` during the build process, replacing them with an object containing all environment variables.
- In the browser’s developer tools, inspect the bundled `main.js` file. You’ll see `import.meta.env` replaced with an object like:

```javascript
{
  APP_API_URL: "https://api.example.com",
  APP_APP_NAME: "MyViteApp",
  MODE: "development",
  PROD: false,
  DEV: true
}
```

## Additional Notes
- **Security**: Always use the prefix (e.g., `APP_`) to explicitly include environment variables in the client bundle. Avoid exposing sensitive data (e.g., database credentials) in `.env` files loaded by Vite.
- **Multiple Modes**: Create as many `.env.[mode]` files as needed for different environments (e.g., `.env.testing`, `.env.qa`).
- **TypeScript Support**: If using TypeScript, you can define types for `import.meta.env` in a `vite-env.d.ts` file:

```typescript
interface ImportMetaEnv {
  readonly APP_API_URL: string;
  readonly APP_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- **Best Practices**: Use descriptive variable names and organize `.env` files by mode to keep configurations clear and maintainable.

This setup allows you to effectively manage environment variables in Vite projects, tailoring configurations for different environments and ensuring secure and flexible access in both JavaScript and HTML files.