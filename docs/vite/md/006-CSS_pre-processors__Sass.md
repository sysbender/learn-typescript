 
# 📘 CSS Preprocessors in Vite Projects

This guide demonstrates how to use CSS preprocessors—specifically **Sass (SASS/SCSS)**—in a Vite project. We'll walk through setup, compilation, and integration with CSS Modules.

---

## 🛠 Step 1: Create and Import a Sass Stylesheet

### 📂 File Structure
Place your Sass file in the `assets` folder.

```bash
assets/
└── 6.scss
```

### 📄 Import in `main.js`

```js
import './assets/6.scss';
```

Make sure the file extension is `.scss` (or `.sass` if using indented syntax).

---

## 📦 Step 2: Install Sass Compiler

Vite supports preprocessors like Sass, Less, and Stylus out of the box. To use Sass:

```bash
npm install -D sass
```

After installation, restart the development server:

```bash
npm run dev
```

---

## 🎨 Step 3: Write Sass Code

Example Sass syntax:

```scss
$primary-color: #3498db;

.wrapper {
  color: $primary-color;
  padding: 1rem;
}
```

This will be compiled into valid CSS and injected into the page.

---

## 🧪 Step 4: Verify Compilation

In the browser, inspect the page to confirm that styles from the Sass file are applied. Vite compiles Sass to CSS, then transforms it into ECMAScript code that injects styles into the `<head>`.

---

## 🧩 Step 5: Using CSS Modules with Preprocessors

To enable CSS Modules with Sass:

### ✅ Rename the file

```bash
6.module.scss
```

### 📄 Import in `main.js`

```js
import styles from './assets/6.module.scss';
console.log(styles);
```

If the Sass file contains a class like:

```scss
.wrapper {
  background: #f0f0f0;
}
```

Then `styles.wrapper` will be a unique class name (e.g., `wrapper_abc123`) that you can use in JavaScript:

```js
document.body.classList.add(styles.wrapper);
```

This class will be injected into the `<head>` and applied to the DOM.

---

## ✅ Summary

- Vite supports Sass, Less, and Stylus with minimal setup.
- Sass files are compiled and injected automatically.
- CSS Modules work seamlessly with preprocessors.
- Use `.module.scss` for modular styles and access them as JS objects.

---

## 📚 Bonus

Vite also supports importing JSON, and combining CSS Modules with preprocessors for scalable styling architecture.

 