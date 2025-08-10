# Vite Course – Lesson 3: Working with CSS in Vite Projects

## Overview
In this lesson, we’ll learn how Vite handles CSS imports, including automatic style injection and inline CSS imports as strings. We’ll also see how Vite transforms CSS files into valid ECMAScript modules.

---

## Step 1 – Creating a CSS File
We will create a CSS file to apply basic styling to our Vite project.

**File Structure:**
```
src/
  assets/
    3.css
```

**3.css:**
```css
body {
  background-color: #333; /* Dark gray */
  color: white;
}
```

---

## Step 2 – Importing CSS in JavaScript
Open **main.js** and import the CSS file.

```javascript
import './assets/3.css';
```

**Result:**  
Vite applies the CSS instantly without manually refreshing the page.

---

## Step 3 – How Vite Handles CSS Imports
When importing CSS:
- Vite transforms the CSS file into a **valid ECMAScript module**.
- The CSS content is stored in a JavaScript constant as a string.
- This string is injected into a `<style>` tag in the `<head>`.

Example transformation:
```javascript
const css = "body { background-color: #333; color: white; }";
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
```

---

## Step 4 – Importing CSS Inline
We can import CSS content as a **string** by adding the `?inline` query parameter.

```javascript
import styles from './assets/3.css?inline';

console.log(styles); // Logs CSS content as a string
```

**What happens:**
- Vite detects the `?inline` parameter.
- Instead of injecting the styles, Vite **exports them as a string** from the generated module.

---

## Step 5 – Manually Injecting Inline CSS
You can manually create and append a style element.

```javascript
import styles from './assets/3.css?inline';

const styleElement = document.createElement('style');
styleElement.innerText = styles;

document.head.appendChild(styleElement);
```

This produces the same visual result as importing CSS normally.

---

## Step 6 – Summary
- **Normal Import:** Automatically injects styles into the page.
- **`?inline` Import:** Returns CSS as a string, giving you control over injection.
- Vite’s transformation enables direct CSS imports in JavaScript.

**Next:** We’ll continue working with CSS in the next lesson.

---

## Commands Recap
```bash
# Start development server
npm run dev
```

**Key Points:**
- Vite processes CSS into JavaScript modules.
- Styles are injected automatically unless imported with `?inline`.
