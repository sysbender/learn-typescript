# Integrating TypeScript with ESLint in a Vite Project

This guide walks you through the process of integrating ESLint, a static analysis tool, with TypeScript in a Vite project. We'll cover installing dependencies, configuring ESLint for TypeScript, running ESLint checks, and integrating it with Vite's build process.

## Prerequisites
- A Vite project with TypeScript already set up.
- Node.js and npm installed on your system.
- A code editor (e.g., VS Code) and a terminal.

## Step 1: Introducing an ESLint Violation
To demonstrate ESLint's functionality, let's intentionally add an ESLint violation in our TypeScript code.

1. Open `src/main.ts`.
2. Add a semicolon after a function declaration, which is not recommended in TypeScript/JavaScript for certain cases and will trigger an ESLint error.

**Example**:
```typescript
function example() {}; // Intentional semicolon to trigger ESLint error
```

## Step 2: Installing ESLint and TypeScript ESLint Plugin
ESLint requires a specific plugin to support TypeScript files. We'll install the necessary dependencies.

Run the following command in your terminal to install ESLint and the TypeScript ESLint plugin:

```bash
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
```

### Explanation
- `eslint`: The core ESLint package for static code analysis.
- `@typescript-eslint/parser`: Parses TypeScript code for ESLint.
- `@typescript-eslint/eslint-plugin`: Provides TypeScript-specific linting rules.

## Step 3: Configuring ESLint
Create an ESLint configuration file to define how ESLint should analyze your TypeScript files.

1. Create a file named `.eslintrc.cjs` in the root of your project.
2. Add the following configuration:

<xaiArtifact artifact_id="cda6ab97-e497-49da-aa79-4bb673e2d9e4" artifact_version_id="d76d11b2-4572-43c0-867c-e020820459c7" title=".eslintrc.cjs" contentType="text/javascript">
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // Example rule to catch semicolon after function declaration
    'no-extra-semi': 'error',
  },
};