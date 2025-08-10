
# 📘 Using JSON Files in Vite Projects

Vite makes it incredibly simple to work with JSON files in JavaScript. JSON files can be imported directly as native ECMAScript modules, allowing seamless integration and transformation.

---

## 📦 Step 1: Create a JSON File

Create a basic JSON file, e.g., `person.json`:

```json
{
  "name": "Alice",
  "age": 30
}
```

Place it in your project directory (e.g., `assets/person.json`).

---

## 📄 Step 2: Import JSON in JavaScript

In your JavaScript file (e.g., `main.js`), import the JSON file:

```js
import data from './assets/person.json';

console.log(data);
```

This will log the entire JSON object to the console.

---

## 🔍 What Happens Behind the Scenes

When the browser encounters the JSON import:

1. It sends a request to the Vite dev server.
2. Vite transforms the JSON into a valid ECMAScript module.
3. The transformed module exports:
   - Each field individually.
   - The entire object as the default export.

### ✅ Example Transformation

Given this JSON:

```json
{
  "name": "Alice",
  "age": 30
}
```

Vite transforms it into:

```js
export const name = "Alice";
export const age = 30;
export default {
  name,
  age
};
```

---

## 🧪 Step 3: Destructure the JSON Object

You can destructure the imported object:

```js
const { name, age } = data;
console.log(name); // "Alice"
console.log(age);  // 30
```

This gives you direct access to individual fields.

---

## ✅ Summary

- JSON files can be imported directly in Vite projects.
- Vite transforms JSON into ECMAScript modules.
- You get both named exports and a default export.
- Destructuring works seamlessly.

---

## 📚 Bonus

This feature is especially useful for:
- Configuration files
- Mock data
- Static content
 