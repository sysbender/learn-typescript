# Vite Course – Lesson 5: Using PostCSS and Tailwind CSS

## Overview
This lesson demonstrates how to apply PostCSS transformations in Vite projects, focusing on installing and using the popular **Tailwind CSS** framework.

---

## Step 1: Install Required Packages

Skip the first initialization step if your Vite project is ready.

Run the following command to install Tailwind CSS, PostCSS, and Autoprefixer:

```bash
npm install -D tailwindcss postcss autoprefixer
```

---

## Step 2: Generate Configuration Files

Run the command below to generate Tailwind and PostCSS config files:

```bash
npx tailwindcss init -p
```

This creates:

- `tailwind.config.js` — Tailwind CSS configuration
- `postcss.config.js` — PostCSS configuration with Tailwind and Autoprefixer plugins preconfigured

---

## Step 3: Configure Tailwind Content Paths

In `tailwind.config.js`, specify which files will include Tailwind classes:

```js
module.exports = {
  content: ["./index.html"], // or other source files with Tailwind classes
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## Step 4: Add Tailwind Directives to CSS

Create a new CSS file `src/assets/5.css` and add these directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 5: Import Tailwind CSS in JavaScript

In `main.js`, clear previous imports and import the new Tailwind CSS file:

```javascript
import './assets/5.css';
```

---

## Step 6: Run Vite Development Server

Stop the existing server with `Ctrl+C`, then restart:

```bash
npm run dev
```

---

## Step 7: Use Tailwind Classes in HTML

Example: Add background and text color to `body` element:

```html
<body class="bg-[#1e293b] text-white">
  <h1>Hello Vite with Tailwind!</h1>
</body>
```

- `bg-[#1e293b]` applies a dynamic background color.
- `text-white` applies white text color.

Changes reflect instantly due to Vite’s Hot Module Replacement (HMR).

---

## How It Works

- Vite processes your CSS files through PostCSS and the Tailwind plugin on the fly.
- Tailwind directives are transformed into full CSS stylesheets.
- The final CSS is converted into a valid ECMAScript module that Vite injects into your page.
- Hot Module Replacement allows instant style updates without page refresh.

---

## Summary

- Install Tailwind, PostCSS, and Autoprefixer packages.
- Generate config files using `npx tailwindcss init -p`.
- Configure Tailwind’s content paths.
- Add Tailwind directives in CSS file and import it.
- Run Vite dev server to see Tailwind styles applied dynamically.

