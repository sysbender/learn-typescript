# Vite Project Scripts and ES Module Imports

## Overview
In this lesson, we explore:
- Vite's preconfigured scripts (`dev`, `build`, `preview`)
- Using **native ES modules** in the browser
- Importing npm packages directly
- How Vite transforms imports from `node_modules`
- Organizing source code in a `src` folder

---

## 1. Preconfigured Scripts in `package.json`

When you create a Vite project, `package.json` includes **three scripts**:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Script Details:
1. **`dev`** – Starts local development server.
   ```bash
   npm run dev
   ```
2. **`build`** – Builds project for production with optimizations.
   ```bash
   npm run build
   ```
3. **`preview`** – Serves the built project locally to preview production behavior.
   ```bash
   npm run preview
   ```

All scripts use the **Vite binary** installed via `npm install vite`. This binary is in `node_modules/.bin`.

---

## 2. Native ES Module Imports

Vite uses native **ES modules** supported by modern browsers.

Example:

`index.html`
```html
<script type="module" src="/main.js"></script>
```

`main.js`
```javascript
import './a.js';
```

When the browser loads `main.js`:
- It parses the file
- Encounters `import './a.js'`
- Makes an **extra request** to fetch `a.js`
- Executes it

`a.js`
```javascript
console.log("Module A loaded");
```

**Result:** Message appears in the browser console.

---

## 3. Importing npm Packages in Vite

Example: using **collect.js**

```bash
npm install collect.js
```

In `main.js`:
```javascript
import collect from 'collect.js';

const numbers = collect([1, 2, 3, 4]);
console.log(numbers.avg()); // Outputs: 2.5
```

### How Vite Handles npm Imports
- Static servers **cannot** import from `node_modules` directly.
- Vite **rewrites** import paths:
  - `import collect from 'collect.js'`
  - → transformed to `/node_modules/.vite/deps/collect.js`
- Vite optimizes and caches dependencies in `.vite/deps`.

---

## 4. Inspecting Vite Transformations

Install the Inspect plugin:
```bash
npm install vite-plugin-inspect --save-dev
```

In `vite.config.js`:
```javascript
import Inspect from 'vite-plugin-inspect';

export default {
  plugins: [Inspect()]
}
```

Visit `/__inspect/` in your dev server to see:
- Original source code
- Transformed code sent to the browser

Example:
- **Local module**: no transformation needed
- **npm package**: import path rewritten

---

## 5. Organizing Source Files

**Common convention**: Store source files in `src`.

```bash
mkdir src
mv a.js src/a.js
```

Update `main.js`:
```javascript
import './src/a.js';
import collect from 'collect.js';

console.log(collect([1, 2, 3, 4]).avg());
```

---

## Summary
- **`dev`**: Live reload + ES module support
- **`build`**: Production-optimized output
- **`preview`**: Test production build locally
- Vite enables **native ES module imports** in browsers
- npm packages are transformed for browser compatibility
- Organize code in `src` for maintainability
