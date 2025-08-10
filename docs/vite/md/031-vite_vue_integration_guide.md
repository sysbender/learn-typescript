# Vite Vue Framework Integration Guide

## Overview

This guide covers how to manually integrate Vue.js framework into a Vite project. You'll learn the step-by-step process of setting up Vue with Vite, understanding the transformation process, and creating your first Vue components.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Installing Dependencies](#installing-dependencies)
4. [Vite Configuration](#vite-configuration)
5. [Creating Vue Components](#creating-vue-components)
6. [Application Initialization](#application-initialization)
7. [Understanding Transformations](#understanding-transformations)
8. [Development Workflow](#development-workflow)
9. [Advanced Configuration](#advanced-configuration)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### Initial Vite Project

Start with a basic Vite project:

```bash
# Create new Vite project
npm create vite@latest my-vue-app
cd my-vue-app

# Or manually scaffold
mkdir my-vue-app
cd my-vue-app
npm init -y
```

### Project Structure

```
my-vue-app/
├── public/
├── src/
│   ├── main.js
│   └── App.vue
├── index.html
├── package.json
└── vite.config.js
```

## Project Setup

### Starting Development Server

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### HTML Template

Ensure your `index.html` has a mount point:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

## Installing Dependencies

### Required Dependencies

Install Vue framework and the Vite Vue plugin:

```bash
# Install Vue.js framework
npm install vue

# Install Vite Vue plugin for .vue file transformation
npm install @vitejs/plugin-vue --save-dev
```

### Package.json Dependencies

Your `package.json` should include:

```json
{
  "name": "my-vue-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.3.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.3",
    "vite": "^4.4.5"
  }
}
```

### Optional Development Tools

```bash
# For inspecting Vite transformations
npm install vite-plugin-inspect --save-dev

# For better development experience
npm install @vue/devtools --save-dev
```

## Vite Configuration

### Basic vite.config.js

Configure Vite to handle Vue files:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

### Advanced Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue({
      // Vue plugin options
      include: [/\.vue$/], // Only process .vue files
      exclude: [/\.md$/],  // Exclude markdown files
    })
  ],
  
  // Development server configuration
  server: {
    port: 3000,
    host: 'localhost',
    open: true // Auto-open browser
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  }
})
```

### With Inspection Plugin

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    vue(),
    Inspect() // Access at http://localhost:3000/__inspect/
  ],
})
```

## Creating Vue Components

### Basic Counter Component (App.vue)

```vue
<template>
  <div class="app">
    <h1>Counter App</h1>
    <div class="counter-container">
      <h2>Count: {{ count }}</h2>
      <button @click="increment" class="increment-btn">
        Increment
      </button>
      <button @click="decrement" class="decrement-btn">
        Decrement
      </button>
      <button @click="reset" class="reset-btn">
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive variable to store counter value
const count = ref(0)

// Methods to modify the counter
function increment() {
  count.value++
  console.log(`Counter incremented to: ${count.value}`)
}

function decrement() {
  count.value--
  console.log(`Counter decremented to: ${count.value}`)
}

function reset() {
  count.value = 0
  console.log('Counter reset to 0')
}
</script>

<style scoped>
.app {
  text-align: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.counter-container {
  margin-top: 2rem;
  padding: 2rem;
  border: 2px solid #007acc;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 400px;
  margin: 2rem auto;
}

h1 {
  color: #007acc;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  margin: 1rem 0;
  color: #333;
}

button {
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.increment-btn {
  background-color: #4caf50;
  color: white;
}

.increment-btn:hover {
  background-color: #45a049;
}

.decrement-btn {
  background-color: #f44336;
  color: white;
}

.decrement-btn:hover {
  background-color: #da190b;
}

.reset-btn {
  background-color: #008cba;
  color: white;
}

.reset-btn:hover {
  background-color: #007bb5;
}
</style>
```

### Alternative Options API Syntax

```vue
<template>
  <div class="app">
    <h1>{{ title }}</h1>
    <div class="counter-container">
      <h2>Count: {{ count }}</h2>
      <button @click="increment">Increment</button>
      <p v-if="count > 10" class="warning">
        Count is getting high!
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'App',
  setup() {
    // Reactive data
    const count = ref(0)
    const title = ref('Vue Counter App')
    
    // Methods
    const increment = () => {
      count.value++
    }
    
    // Return to template
    return {
      count,
      title,
      increment
    }
  }
}
</script>

<style scoped>
.warning {
  color: orange;
  font-weight: bold;
}
</style>
```

### Component with Props and Emits

```vue
<!-- CounterDisplay.vue -->
<template>
  <div class="counter-display">
    <h3>{{ label }}</h3>
    <div class="count-value">{{ modelValue }}</div>
    <div class="controls">
      <button @click="handleIncrement" :disabled="modelValue >= max">
        +
      </button>
      <button @click="handleDecrement" :disabled="modelValue <= min">
        -
      </button>
    </div>
  </div>
</template>

<script setup>
// Define props
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: 'Counter'
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  }
})

// Define emits
const emit = defineEmits(['update:modelValue'])

// Methods
function handleIncrement() {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}

function handleDecrement() {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}
</script>

<style scoped>
.counter-display {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  text-align: center;
}

.count-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #007acc;
}

.controls button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 4px;
  background-color: #007acc;
  color: white;
  cursor: pointer;
}

.controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.controls button:not(:disabled):hover {
  background-color: #005c99;
}
</style>
```

## Application Initialization

### Basic main.js

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// Create Vue application
const app = createApp(App)

// Mount to DOM element
app.mount('#app')

console.log('🚀 Vue application initialized')
```

### Advanced main.js with Configuration

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// Optional: Global styles
import './style.css'

// Create application instance
const app = createApp(App)

// Global properties
app.config.globalProperties.$appVersion = '1.0.0'
app.config.globalProperties.$apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error)
  console.error('Component:', instance)
  console.error('Error info:', info)
}

// Performance tracking
app.config.performance = import.meta.env.DEV

// Mount application
app.mount('#app')

// Development logging
if (import.meta.env.DEV) {
  console.log('🔥 Vue app mounted in development mode')
  console.log('📦 Vue version:', app.version)
}
```

### With Multiple Components

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// Import global components
import CounterDisplay from './components/CounterDisplay.vue'
import UserProfile from './components/UserProfile.vue'

const app = createApp(App)

// Register global components
app.component('CounterDisplay', CounterDisplay)
app.component('UserProfile', UserProfile)

// Global directives
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

app.mount('#app')
```

### Using the Global Components

```vue
<!-- App.vue -->
<template>
  <div class="app">
    <h1>My Vue App</h1>
    
    <!-- Using globally registered component -->
    <CounterDisplay 
      v-model="primaryCounter" 
      label="Primary Counter"
      :max="50"
    />
    
    <CounterDisplay 
      v-model="secondaryCounter" 
      label="Secondary Counter"
      :min="-10"
      :max="20"
    />
    
    <UserProfile :user="currentUser" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const primaryCounter = ref(0)
const secondaryCounter = ref(0)
const currentUser = ref({
  name: 'John Doe',
  email: 'john@example.com'
})
</script>
```

## Understanding Transformations

### Vue File Structure

```vue
<!-- Component.vue -->
<template>
  <!-- HTML template -->
</template>

<script setup>
  // JavaScript logic
</script>

<style scoped>
  /* Component styles */
</style>
```

### How Vite Transforms .vue Files

1. **Template Block** → Render function
2. **Script Block** → Component logic
3. **Style Block** → CSS modules or scoped styles

### Inspecting Transformations

Access `http://localhost:3000/__inspect/` to see:

```javascript
// Original .vue file transforms to:
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const count = ref(0)
    return { count }
  },
  render() {
    return h('div', [
      h('h1', 'Counter'),
      h('p', this.count),
      h('button', { onClick: () => this.count++ }, 'Increment')
    ])
  }
})
```

### Network Tab Inspection

1. Browser requests `main.js`
2. `main.js` imports `App.vue`
3. Vite transforms `App.vue` to JavaScript
4. Browser receives transformed code

## Development Workflow

### Hot Module Replacement

Vue components support HMR out of the box:

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>{{ message }}</h1>
    <p>Change this message to see HMR in action!</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue + Vite!')

// HMR is automatic - no additional code needed
console.log('🔥 Component loaded/updated')
</script>
```

### Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking (if using TypeScript)
npm run type-check
```

### Environment Variables

```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
```

```javascript
// Use in components
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('Debug mode:', import.meta.env.VITE_DEBUG)
```

## Advanced Configuration

### TypeScript Support

```bash
# Install TypeScript dependencies
npm install typescript @vue/tsconfig --save-dev
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
})
```

### CSS Preprocessors

```bash
# Install Sass
npm install sass --save-dev
```

```vue
<style lang="scss" scoped>
$primary-color: #007acc;

.component {
  color: $primary-color;
  
  &:hover {
    opacity: 0.8;
  }
}
</style>
```

### Vue Router Integration

```bash
npm install vue-router@4
```

```javascript
// router.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import About from './components/About.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

### State Management (Pinia)

```bash
npm install pinia
```

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

## Troubleshooting

### Common Issues

1. **Vue Plugin Not Working**
```javascript
// ❌ Incorrect
import vue from 'vue'

// ✅ Correct
import vue from '@vitejs/plugin-vue'
```

2. **Component Not Found**
```javascript
// ❌ Missing file extension
import App from './App'

// ✅ Include .vue extension
import App from './App.vue'
```

3. **HMR Not Working**
```javascript
// Check if Vue DevTools are installed
// Ensure proper file extensions
// Verify Vite config includes Vue plugin
```

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for conflicting dependencies
npm ls

# Verify build output
npm run build
```

### Development Server Issues

```bash
# Check port conflicts
netstat -tulpn | grep :3000

# Clear Vite cache
rm -rf node_modules/.vite

# Restart with clean cache
npm run dev -- --force
```

## Quick Start Template

Create a complete Vue + Vite project structure:

```bash
# Create project
mkdir my-vue-vite-app
cd my-vue-vite-app

# Initialize package.json
npm init -y

# Install dependencies
npm install vue
npm install @vitejs/plugin-vue vite --save-dev

# Create files
touch vite.config.js
mkdir src
touch src/main.js src/App.vue
touch index.html
```

This guide provides a complete foundation for integrating Vue.js with Vite, from basic setup to advanced configuration and troubleshooting.