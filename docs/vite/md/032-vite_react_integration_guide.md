# Vite React Framework Integration Guide

## Overview

This guide covers how to manually integrate React framework into a Vite project. You'll learn the step-by-step process of setting up React with Vite, understanding JSX transformations, and creating your first React components with modern hooks.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Installing Dependencies](#installing-dependencies)
4. [Vite Configuration](#vite-configuration)
5. [File Structure Setup](#file-structure-setup)
6. [Creating React Components](#creating-react-components)
7. [Application Initialization](#application-initialization)
8. [CSS Integration](#css-integration)
9. [Understanding Transformations](#understanding-transformations)
10. [Advanced Configuration](#advanced-configuration)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

## Prerequisites

### Initial Vite Project

Start with a basic Vite project:

```bash
# Create new Vite project
npm create vite@latest my-react-app
cd my-react-app

# Or manually scaffold
mkdir my-react-app
cd my-react-app
npm init -y
```

### Quick Setup Alternative

For reference, you can also use the template option:

```bash
# Auto-scaffold with React (alternative approach)
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

*Note: We'll do manual integration to understand the process.*

## Project Setup

### Initial Project Structure

```
my-react-app/
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── App.css
├── index.html
├── package.json
└── vite.config.js
```

### HTML Template

Ensure your `index.html` has a React mount point:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## Installing Dependencies

### Required Dependencies

Install React, React DOM, and the Vite React plugin:

```bash
# Install React framework
npm install react react-dom

# Install Vite React plugin for JSX transformation
npm install @vitejs/plugin-react --save-dev
```

### Package.json Dependencies

Your `package.json` should include:

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```

### Optional Development Tools

```bash
# For inspecting Vite transformations
npm install vite-plugin-inspect --save-dev

# ESLint for code quality
npm install eslint @vitejs/eslint-config-react --save-dev

# For React development tools
npm install @vitejs/plugin-react-refresh --save-dev
```

## Vite Configuration

### Basic vite.config.js

Configure Vite to handle React JSX files:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Advanced Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      // React plugin options
      include: "**/*.{jsx,tsx}",
      babel: {
        plugins: [
          // Add babel plugins if needed
        ]
      }
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
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // Define global constants
  define: {
    __DEV__: JSON.stringify(true)
  }
})
```

### With Inspection Plugin

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    react(),
    Inspect() // Access at http://localhost:3000/__inspect/
  ],
})
```

## File Structure Setup

### Rename main.js to main.jsx

Since we'll use JSX syntax, rename the main file:

```bash
# Rename main.js to main.jsx
mv src/main.js src/main.jsx
```

### Update index.html Reference

```html
<!-- Update the script src in index.html -->
<script type="module" src="/src/main.jsx"></script>
```

## Creating React Components

### Basic Counter Component (App.jsx)

```jsx
// src/App.jsx
import { useState } from 'react'
import './App.css'

function App() {
  // State for counter
  const [count, setCount] = useState(0)
  
  // Handler functions
  const increment = () => {
    setCount(count + 1)
    console.log(`Counter incremented to: ${count + 1}`)
  }
  
  const decrement = () => {
    setCount(count - 1)
    console.log(`Counter decremented to: ${count - 1}`)
  }
  
  const reset = () => {
    setCount(0)
    console.log('Counter reset to 0')
  }
  
  return (
    <div className="app">
      <h1>React Counter App</h1>
      <div className="counter-container">
        <h2>Count: {count}</h2>
        <div className="button-group">
          <button 
            onClick={increment}
            className="increment-btn"
          >
            Increment ({count})
          </button>
          <button 
            onClick={decrement}
            className="decrement-btn"
          >
            Decrement
          </button>
          <button 
            onClick={reset}
            className="reset-btn"
          >
            Reset
          </button>
        </div>
        {count > 10 && (
          <p className="warning">Count is getting high!</p>
        )}
      </div>
    </div>
  )
}

export default App
```

### Component with Multiple State Variables

```jsx
// src/components/UserProfile.jsx
import { useState, useEffect } from 'react'

function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Effect hook example
  useEffect(() => {
    console.log('User profile mounted or updated')
    
    // Cleanup function
    return () => {
      console.log('User profile cleanup')
    }
  }, [user])
  
  const handleInputChange = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }))
  }
  
  const handleSave = async () => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setLoading(false)
    setIsEditing(false)
    console.log('User saved:', user)
  }
  
  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={user.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
          />
          
          <div className="button-group">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="save-btn"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-display">
          <p><strong>Name:</strong> {user.name || 'Not set'}</p>
          <p><strong>Email:</strong> {user.email || 'Not set'}</p>
          <p><strong>Age:</strong> {user.age || 'Not set'}</p>
          
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-btn"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  )
}

export default UserProfile
```

### Component with Props and Children

```jsx
// src/components/Card.jsx
import { useState } from 'react'
import './Card.css'

function Card({ title, subtitle, children, variant = 'default', collapsible = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  const cardClasses = [
    'card',
    `card--${variant}`,
    isCollapsed && 'card--collapsed'
  ].filter(Boolean).join(' ')
  
  return (
    <div className={cardClasses}>
      <div className="card__header">
        <div className="card__title-section">
          <h3 className="card__title">{title}</h3>
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
        
        {collapsible && (
          <button
            className="card__collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="card__content">
          {children}
        </div>
      )}
    </div>
  )
}

export default Card
```

### Custom Hook Example

```jsx
// src/hooks/useCounter.js
import { useState, useCallback } from 'react'

function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue)
  
  const increment = useCallback(() => {
    setCount(prevCount => prevCount + step)
  }, [step])
  
  const decrement = useCallback(() => {
    setCount(prevCount => prevCount - step)
  }, [step])
  
  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])
  
  const setValue = useCallback((value) => {
    setCount(value)
  }, [])
  
  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  }
}

export default useCounter
```

```jsx
// Using the custom hook
// src/components/CounterWithHook.jsx
import useCounter from '../hooks/useCounter'

function CounterWithHook() {
  const { count, increment, decrement, reset } = useCounter(0, 2)
  
  return (
    <div>
      <h2>Counter with Custom Hook</h2>
      <p>Count: {count}</p>
      <button onClick={increment}>+2</button>
      <button onClick={decrement}>-2</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

export default CounterWithHook
```

## Application Initialization

### Basic main.jsx

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Create root and render application
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

console.log('🚀 React application initialized')
```

### Advanced main.jsx with Error Boundary

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Development logging
if (import.meta.env.DEV) {
  console.log('🔥 React app starting in development mode')
  console.log('📦 React version:', React.version)
}

// Create root element
const rootElement = document.getElementById('app')

if (!rootElement) {
  throw new Error('Root element with id "app" not found')
}

// Create React root
const root = ReactDOM.createRoot(rootElement)

// Render with error boundary
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
```

### Error Boundary Component

```jsx
// src/components/ErrorBoundary.jsx
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }
  
  static getDerivedStateFromError(error) {
    // Update state to show error UI
    return { hasError: true }
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px',
          border: '2px solid red',
          borderRadius: '8px',
          margin: '20px',
          backgroundColor: '#fee'
        }}>
          <h2>🚨 Something went wrong</h2>
          <p>An error occurred in the React application.</p>
          
          {import.meta.env.DEV && (
            <details style={{ marginTop: '20px' }}>
              <summary>Error Details (Development)</summary>
              <pre style={{ 
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}

export default ErrorBoundary
```

## CSS Integration

### Component CSS (App.css)

```css
/* src/App.css */
.app {
  text-align: center;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.counter-container {
  margin-top: 2rem;
  padding: 2rem;
  border: 2px solid #007acc;
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  max-width: 500px;
  margin: 2rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #007acc;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
  margin: 1rem 0;
  color: #333;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 120px;
}

.increment-btn {
  background-color: #4caf50;
  color: white;
}

.increment-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.decrement-btn {
  background-color: #f44336;
  color: white;
}

.decrement-btn:hover {
  background-color: #da190b;
  transform: translateY(-2px);
}

.reset-btn {
  background-color: #008cba;
  color: white;
}

.reset-btn:hover {
  background-color: #007bb5;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.warning {
  color: #ff6b35;
  font-weight: bold;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
}

/* Responsive design */
@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .counter-container {
    padding: 1rem;
    margin: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  button {
    width: 100%;
    max-width: 200px;
  }
}
```

### Global CSS (index.css)

```css
/* src/index.css */
:root {
  --primary-color: #007acc;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Utility classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }

.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
```

## Understanding Transformations

### JSX to JavaScript Transformation

Vite transforms JSX syntax into React.createElement calls:

```jsx
// Original JSX
function App() {
  return (
    <div className="app">
      <h1>Hello React</h1>
      <button onClick={() => console.log('clicked')}>
        Click me
      </button>
    </div>
  )
}
```

Transforms to:

```javascript
// Transformed JavaScript
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'

function App() {
  return _jsxs('div', {
    className: 'app',
    children: [
      _jsx('h1', { children: 'Hello React' }),
      _jsx('button', {
        onClick: () => console.log('clicked'),
        children: 'Click me'
      })
    ]
  })
}
```

### Inspecting Transformations

Use the inspect plugin to see transformations:

1. Install: `npm install vite-plugin-inspect --save-dev`
2. Add to config: `plugins: [react(), Inspect()]`
3. Visit: `http://localhost:3000/__inspect/`

### Network Tab Analysis

1. Browser requests `main.jsx`
2. `main.jsx` imports `App.jsx`
3. Vite transforms JSX to JavaScript
4. Browser receives transformed code
5. React renders components

## Advanced Configuration

### TypeScript Support

```bash
# Install TypeScript dependencies
npm install typescript @types/react @types/react-dom --save-dev
```

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### CSS Modules

```jsx
// Component.module.css
.container {
  background: red;
}

.title {
  color: blue;
}
```

```jsx
// Component.jsx
import styles from './Component.module.css'

function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Styled with CSS Modules</h1>
    </div>
  )
}
```

### CSS-in-JS with Styled Components

```bash
npm install styled-components
npm install @types/styled-components --save-dev
```

```jsx
import styled from 'styled-components'

const StyledButton = styled.button`
  background: ${props => props.primary ? 'blue' : 'white'};
  color: ${props => props.primary ? 'white' : 'blue'};
  border: 2px solid blue;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.primary ? 'darkblue' : 'lightblue'};
  }
`

function App() {
  return (
    <div>
      <StyledButton primary>Primary Button</StyledButton>
      <StyledButton>Secondary Button</StyledButton>
    </div>
  )
}
```

## Best Practices

### Component Organization

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── index.js
│   │   └── Card/
│   └── pages/
├── hooks/
├── services/
├── utils/
└── styles/
```

### Performance Optimization

```jsx
// Use React.memo for expensive components
import { memo } from 'react'

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{/* expensive rendering */}</div>
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id
})
```

```jsx
// Use useCallback and useMemo
import { useCallback, useMemo } from 'react'

function OptimizedComponent({ items, onItemClick }) {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0)
  }, [items])
  
  const handleClick = useCallback((id) => {
    onItemClick(id)
  }, [onItemClick])
  
  return <div>{/* component content */}</div>
}
```

## Troubleshooting

### Common Issues

1. **JSX Not Transforming**
```jsx
// ❌ Missing React import (older React versions)
function Component() {
  return <div>Hello</div>
}

// ✅ Correct with modern React + Vite
function Component() {
  return <div>Hello</div> // Works automatically
}
```

2. **CSS Not Loading**
```jsx
// ❌ Wrong import path
import './styles.css' // File doesn't exist

// ✅ Correct import
import './App.css' // File exists
```

3. **Plugin Not Working**
```javascript
// ❌ Incorrect plugin import
import react from 'react'

// ✅ Correct plugin import
import react from '@vitejs/plugin-react'
```

This comprehensive guide provides everything needed to integrate React with Vite, from basic setup to advanced optimization techniques.