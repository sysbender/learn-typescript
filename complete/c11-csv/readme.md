

That error —

Cannot find module 'fs' or its corresponding type declarations.ts(2307)
— means TypeScript doesn’t know about Node’s built-in modules.

Here’s how to fix it 👇

✅ Step-by-step fix
1. Install Node.js type definitions

Run this in your project folder:

npm install --save-dev @types/node


This adds type info for all Node built-ins (fs, path, process, etc.).

2. Update your tsconfig.json

Make sure your tsconfig.json includes Node types.

Example:

{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "types": ["node"],
    "esModuleInterop": true,
    "strict": true
  }
}


