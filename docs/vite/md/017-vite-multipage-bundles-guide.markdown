# Generating Multiple Bundles for Multipage Applications in Vite

This guide explains how to configure Vite to generate separate bundles for multiple pages in a multipage application. Each page will have its own HTML file, JavaScript bundle, and optional CSS/SCSS files, allowing independent page rendering and navigation.

## Prerequisites
- A Vite project set up with JavaScript or TypeScript.
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.
- Basic project structure with an `src` folder.

## Step 1: Setting Up Multiple Pages
We’ll create two pages: an `index` page and a `login` page, each with its own HTML and JavaScript files.

1. **Update `index.html`**:
   Modify the root `index.html` to include a heading and a link to the login page.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index Page</title>
</head>
<body>
  <h1>Index Page</h1>
  <a href="/login/login.html">Go to Login</a>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

2. **Create the Login Page**:
   - Create a `login` folder in the project root.
   - Inside `login`, create `login.html` and `login.js`.

**`login/login.html`**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Page</title>
</head>
<body>
  <h1>Login Page</h1>
  <a href="/index.html">Go to Index</a>
  <script type="module" src="/login/login.js"></script>
</body>
</html>
```

**`login/login.js`**:
```javascript
console.log('Login page loaded');
```

3. **Add Content to `src/main.js`**:
   Add a simple log to differentiate the main page’s script.

```javascript
console.log('Index page loaded');
```

4. **Run the Development Server**:
   Start the Vite dev server to test navigation:

```bash
npm run dev
```

5. Open the browser (usually at `http://localhost:5173`):
   - The index page (`/`) should display with the heading “Index Page” and a link to the login page.
   - Clicking the link should navigate to `/login/login.html`, showing the “Login Page” heading and a link back to the index page.
   - Navigation triggers full page refreshes, as these are independent pages.

## Step 2: Building the Project (Initial Attempt)
Let’s try building the project for production to see Vite’s default behavior.

1. Run the build command:

```bash
npm run build
```

2. Preview the production build:

```bash
npm run preview
```

3. Open the browser and navigate to the preview URL (e.g., `http://localhost:4173`):
   - The index page loads correctly.
   - Attempting to navigate to `/login/login.html` fails or redirects to the index page because Vite only generated a bundle for `index.html`.

4. Check the `dist` folder:
   - Only `dist/index.html` and its associated assets are generated.
   - The `login` page is missing because Vite’s default configuration assumes a single-page application (SPA).

## Step 3: Configuring Vite for Multipage Builds
To generate bundles for multiple pages, configure Vite’s `rollupOptions.input` in the `vite.config.js` file to specify all HTML entry points.

1. Update `vite.config.js` to include both pages:

```javascript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        login: path.resolve(__dirname, 'login/login.html'),
      },
    },
  },
});
```

### Explanation
- `build.rollupOptions.input`: Specifies multiple entry points for the build.
- `main` and `login`: Keys representing the pages, mapped to their respective HTML files.
- `path.resolve(__dirname, ...)`: Generates absolute paths to the HTML files relative to the project root.

2. Rebuild the project:

```bash
npm run build
```

3. Check the `dist` folder:
   - You should see `dist/index.html` and `dist/login/login.html`, indicating both pages were generated.
   - However, no JavaScript bundles are generated yet because `main.js` and `login.js` are empty or only contain `console.log`.

4. Preview the build:

```bash
npm run preview
```

5. Open the browser:
   - Navigate to `/` to see the index page.
   - Navigate to `/login/login.html` to see the login page.
   - Both pages should load correctly, but no JavaScript bundles are fetched yet.

## Step 4: Adding JavaScript and SCSS
To ensure JavaScript bundles are generated, add meaningful code to `main.js` and `login.js`, and include SCSS files for styling.

1. **Install the Sass Preprocessor**:
   Vite requires the `sass` package to compile SCSS files.

```bash
npm install sass --save-dev
```

2. **Create SCSS Files**:
   - Create `src/main.scss`:

```scss
body {
  background-color: indigo;
  color: white;
}
a {
  color: white;
}
```

   - Create `login/login.scss`:

```scss
body {
  background-color: brown;
  color: white;
}
a {
  color: white;
}
```

3. **Update JavaScript Files**:
   - Update `src/main.js` to import the SCSS file and add a log:

```javascript
import './main.scss';
console.log('Index page loaded');
```

   - Update `login/login.js`:

```javascript
import './login.scss';
console.log('Login page loaded');
```

4. **Run the Development Server**:
   Start the dev server to verify SCSS compilation:

```bash
npm run dev
```

5. Open the browser:
   - The index page (`/`) should have an indigo background.
   - The login page (`/login/login.html`) should have a brown background.
   - Styles are applied correctly, confirming SCSS compilation.

## Step 5: Rebuilding and Verifying Bundles
Rebuild the project to generate JavaScript and CSS bundles for both pages.

1. Run the build command:

```bash
npm run build
```

2. Check the `dist` folder:
   - You should see:
     - `dist/index.html`
     - `dist/login/login.html`
     - JavaScript bundles (e.g., `dist/assets/main-[hash].js`, `dist/login/assets/login-[hash].js`)
     - CSS bundles (e.g., `dist/assets/main-[hash].css`, `dist/login/assets/login-[hash].css`)

3. Preview the build:

```bash
npm run preview
```

4. Open the browser and check the network tab:
   - Navigate to `/` and `/login/login.html`.
   - Confirm that both pages load their respective CSS and JavaScript bundles.
   - The index page has an indigo background, and the login page has a brown background.
   - Console logs (`Index page loaded` and `Login page loaded`) appear in the browser console.

## Step 6: Why JavaScript Bundles Were Initially Missing
- If a JavaScript file only contains a `console.log` or an import (e.g., SCSS), Vite may optimize it out, resulting in no JavaScript bundle.
- Adding meaningful JavaScript code (beyond imports or simple logs) ensures bundle generation, as seen after adding SCSS imports and logs.

## Additional Notes
- **Multipage Configuration**: The `build.rollupOptions.input` object is critical for multipage apps. Each key-value pair maps a page name to an HTML file’s absolute path.
- **Path Resolution**: Use `path.resolve` to ensure correct file paths across different operating systems.
- **SCSS and Other Assets**: Vite supports SCSS, CSS, and other assets out of the box, but preprocessors like `sass` must be installed.
- **TypeScript Support**: If using TypeScript, ensure `.ts` files are referenced correctly in HTML and configured in `vite.config.js`.
- **Best Practices**:
  - Organize pages in separate folders (e.g., `login/login.html`, `login/login.js`) for clarity.
  - Use descriptive names for `input` keys (e.g., `main`, `login`) to reflect page purposes.
  - Test both development (`npm run dev`) and production (`npm run build` + `npm run preview`) environments to ensure consistent behavior.

This setup enables Vite to generate separate bundles for each page in a multipage application, supporting independent HTML, JavaScript, and CSS/SCSS assets for scalable development.