# Vite Course – Lesson 4: Working with CSS Modules

## Overview
In this lesson, we learn how to work with **CSS Modules** in Vite projects to scope styles locally and avoid class name conflicts.

---

## Step 1: Create CSS Module Files

Create two CSS module files inside your `src/assets` folder (or wherever you keep your styles).

- `module4a.module.css`
```css
.heading {
  color: orange;
}
```

- `module4b.module.css`
```css
.heading {
  font-size: 30px;
}
```

You can also import your previously created normal CSS file (e.g., `3.css`).

---

## Step 2: Import CSS Modules in `main.js`

```javascript
import stylesA from './assets/module4a.module.css';
import stylesB from './assets/module4b.module.css';
import './assets/3.css'; // normal CSS import
```

Vite treats CSS files with `.module.css` as **CSS Modules**, transforming them to JavaScript objects where:

- Keys are the **original class names**
- Values are **unique generated class names**

---

## Step 3: Inspecting CSS Modules Output

Console log the imported style objects:

```javascript
console.log(stylesA); // { heading: 'module4a_heading__xyz123' }
console.log(stylesB); // { heading: 'module4b_heading__abc456' }
```

The output shows original class names mapped to unique class names.

---

## Step 4: Applying CSS Module Classes in HTML

Assign unique CSS classes from modules to elements:

```javascript
const headingEl = document.querySelector('h1');

// Apply font size only from module4b
headingEl.className = stylesB.heading;

// To apply both font size and color, concatenate classes:
headingEl.className = `${stylesA.heading} ${stylesB.heading}`;
```

Since class names are unique, styles do not conflict.

---

## Step 5: Using Destructuring & Aliases

You can destructure the imported object to pick only needed classes and rename them:

```javascript
import { heading as headingColor } from './assets/module4a.module.css';
import { heading as headingSize } from './assets/module4b.module.css';

headingEl.className = `${headingColor} ${headingSize}`;
```

---

## Step 6: How Vite Transforms CSS Modules

- Vite generates unique class names to avoid collision across modules.
- The CSS code is injected into the page inside separate `<style>` elements per module.
- The CSS Module files export JavaScript objects mapping original class names to the unique generated class names.

Example transformed CSS module JavaScript export:

```javascript
export default {
  heading: 'module4a_heading__xyz123'
};
```

---

## Summary

- Use `.module.css` suffix to enable CSS Modules in Vite.
- CSS Modules export an object mapping original class names to unique names.
- Apply these unique classes in JavaScript to avoid global CSS conflicts.
- You can selectively import class names using destructuring and aliases.

---

**Next:** Continue exploring Vite features by building on CSS Modules or move to JS/TS integrations.
