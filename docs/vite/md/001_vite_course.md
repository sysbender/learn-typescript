# Course 001 — Introduction to Vite (Modern Frontend Bundler)

**Short description**  
This course is about a new-generation frontend bundler called **Vite**. Vite provides a much faster developer experience compared to older bundlers (for example, webpack). In this short course you'll learn how to create a local Vite project, inspect how Vite transforms source files, and understand common Vite features such as CSS & asset imports and the `public/` folder.

---

## Learning objectives
- Create a Vite project (vanilla JS)
- Start the development server and access the app in the browser
- Install and use the `vite-plugin-inspect` plugin to watch transforms
- Understand how Vite handles CSS and static assets
- Learn best practices for initial project cleanup and structure

---

## Prerequisites
- Node.js (v16+ recommended) and npm installed
- A code editor (VS Code recommended)
- Basic knowledge of JavaScript, HTML and the command line

---

## 1) Create a new Vite project (vanilla JS)

Two options: interactive (will ask questions) or direct template command.

Interactive (choose **vanilla** when prompted):
```bash
# interactive - will ask for project name and framework template
npm create vite@latest
```

Non-interactive (create a vanilla app with a name):
```bash
# non-interactive - creates "my-vite-app" with vanilla template
npm create vite@latest my-vite-app -- --template vanilla

cd my-vite-app
```

**Install dependencies**:
```bash
npm install
```

**Start the dev server**:
```bash
npm run dev
```

When the server starts you will see the local address printed in the terminal (commonly `http://localhost:5173`). Open that URL in your browser to see the default Vite welcome page.

> **Concise explanation:** `npm create vite@latest` scaffolds the project. `npm install` downloads dependencies. `npm run dev` starts Vite's development server (fast HMR, ES modules).

---

## 2) Install the Vite Inspect plugin (optional but highly recommended for learning)

**Install plugin**:
```bash
npm install -D vite-plugin-inspect
```

**Add plugin to `vite.config.js`** (create this file if it doesn't exist):

```js
// vite.config.js
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    Inspect() // opens inspector dashboard in the browser
  ]
})
```

**Restart the dev server** (stop it with `Ctrl+C`, then run `npm run dev` again). The plugin will print an inspector URL in the terminal (usually under the dev server's addresses). Open that inspector URL in your browser to see how Vite transforms your files step-by-step.

> **Concise explanation:** the plugin provides a dashboard for seeing how Vite loads and transforms modules. It's extremely useful for learning and debugging how imports are processed.

---

## 3) What loads when you open the root URL? `index.html`

Open `index.html` at the project root. The `index.html` file usually contains something like:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>
```

Notes:
- Vite serves `index.html` as an entry point and enables module-based development with `<script type="module">`.
- The `main.js` (or `main.ts`) referenced here is loaded as a native ECMAScript module (ESM).

---

## 4) `main.js` — imports, CSS, and assets

Open `main.js`. A default Vite template often shows examples of importing CSS, SVGs and other assets. Example cleaned `main.js` that removes the default demo code and prepares the project for step-by-step lessons:

```js
// main.js -- cleaned for the course
import './style.css'           // CSS imported and injected by Vite
import logoUrl from './logo.svg' // static asset import -> returns a URL string

const app = document.getElementById('app')

app.innerHTML = `
  <h1>Hello Vite</h1>
  <img src="${logoUrl}" alt="Logo" width="200" />
`
```

**Concise explanation:** importing CSS (`import './style.css'`) tells Vite to process the CSS and inject it into the page automatically during development. Importing an asset (like `logo.svg`) returns a URL string you can use in `src` attributes or elsewhere in the DOM.

---

## 5) `public/` folder — static assets that are **not** processed

Place files in the `public/` directory to serve them *as-is* at the project root. For example:

```
public/
  robots.txt        -> available at /robots.txt
  static.png        -> available at /static.png
  images/banner.jpg -> available at /images/banner.jpg
```

**Important:** assets inside `public/` are *not* transformed by Vite. Use `public/` for large static files, icons, or files that must keep their exact path/contents.

---

## 6) How Vite processes CSS & assets (concise)

- `import './style.css'` — Vite loads and applies CSS during dev. In production the CSS is extracted and bundled.
- `import logoUrl from './logo.svg'` — Vite handles assets and returns a URL that points to the file (or processed variant) so you can use it in `img` tags or CSS `background-image`.
- Files in `public/` are served unchanged at root path (`/yourfile.ext`).

---

## 7) Cleaning the default template (recommended first lesson)

The default Vite template often contains demo counters and styles. To make the learning path clearer:
1. Open `main.js` and remove demo imports like `counter.js` and demo code. Replace with a small starting snippet (see `main.js` above).
2. Empty `style.css` or replace with minimal CSS so you can add styles during lessons.
3. Remove unused assets from `src/` (keep or move to `public/` if you still want them).

This keeps the project minimal and focused on understanding Vite's features step-by-step.

---

## 8) Restart server & debugging tips

- After changing `vite.config.js` (for example adding plugins), stop the dev server (`Ctrl+C`) and run `npm run dev` again.
- If a plugin prints an inspector or dashboard URL — open it in the browser to inspect transforms.
- If imports fail, check the path prefix: use leading `/` for absolute paths from project root (`/main.js`) or relative paths (`./module.js`) for local files.
- Check the terminal for helpful errors and the browser console for runtime errors.

---

## 9) Example useful commands summary

```bash
# scaffold project (interactive)
npm create vite@latest

# scaffold non-interactively (vanilla)
npm create vite@latest my-vite-app -- --template vanilla

cd my-vite-app
npm install
npm run dev

# install the inspector plugin
npm i -D vite-plugin-inspect
# then add the plugin to vite.config.js and restart the dev server
```

---

## 10) Next lessons (suggested path)
- CSS imports & pre-processors (Sass) and how Vite handles them
- Assets, static & public, hashed builds and caching
- TypeScript support in Vite projects
- Plugins: how to configure and write simple Vite plugins
- Production build (`npm run build`) and preview (`npm run preview`)

---

## Appendix — Full `vite.config.js` example (ESM)
```js
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [Inspect()],
  // add other Vite options here as the course progresses
})
```

---

**Course source**: converted from your "text 001" input.  
If you want, I can:
- generate a second, more verbose version for beginners, or
- include a step-by-step lesson plan for each timestamp from your earlier list.

---
