# Vite Advanced HMR - Cleanup and Event Handling Guide

## Overview

This guide covers advanced Hot Module Replacement (HMR) techniques in Vite, focusing on cleanup mechanisms with `dispose()` and HMR event handling. You'll learn how to manage side effects, clean up DOM modifications, and hook into the HMR lifecycle.

## Table of Contents

1. [HMR Side Effects Problem](#hmr-side-effects-problem)
2. [The dispose() Method](#the-dispose-method)
3. [DOM Manipulation Cleanup](#dom-manipulation-cleanup)
4. [HMR Event System](#hmr-event-system)
5. [Complete Examples](#complete-examples)
6. [Best Practices](#best-practices)
7. [Advanced Patterns](#advanced-patterns)
8. [Troubleshooting](#troubleshooting)

## HMR Side Effects Problem

### Understanding Side Effects

Side effects are changes that persist beyond module execution:

```javascript
// Examples of side effects
document.body.style.backgroundColor = 'red';     // DOM modification
localStorage.setItem('theme', 'dark');           // Storage modification
window.globalVar = 'value';                      // Global variable
setInterval(() => console.log('tick'), 1000);   // Timer creation
element.addEventListener('click', handler);      // Event listener
```

### The Problem Without Cleanup

```javascript
// problematic-styles.js
let styles = null;

function addStylesheet() {
  // Create style element
  styles = document.createElement('style');
  styles.innerHTML = `
    body {
      background-color: indigo;
      color: white;
    }
  `;
  
  // Append to head - SIDE EFFECT!
  document.head.appendChild(styles);
  console.log('✅ Stylesheet added');
}

// Execute on module load
addStylesheet();

// Basic HMR without cleanup
if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔥 Module updated - but styles accumulate!');
    }
  });
}
```

### Result Without Cleanup

```html
<!-- After multiple HMR updates -->
<head>
  <style>body { background-color: indigo; color: white; }</style>
  <style>body { background-color: blue; color: white; }</style>
  <style>body { background-color: green; color: white; }</style>
  <!-- Multiple style elements accumulate! -->
</head>
```

## The dispose() Method

### Basic dispose() Usage

The `dispose()` method runs cleanup code before HMR updates:

```javascript
// cleanup-example.js
let styles = null;

function addStylesheet() {
  styles = document.createElement('style');
  styles.innerHTML = `
    body {
      background-color: indigo;
      color: white;
    }
  `;
  document.head.appendChild(styles);
  console.log('✅ Stylesheet added');
}

function removeStylesheet() {
  if (styles) {
    styles.remove();
    styles = null;
    console.log('🧹 Stylesheet removed');
  }
}

// Apply styles on load
addStylesheet();

if (import.meta.hot) {
  // Cleanup before updates
  import.meta.hot.dispose(() => {
    removeStylesheet();
  });
  
  // Accept updates
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔥 Module updated cleanly');
    }
  });
}
```

### dispose() Execution Flow

```javascript
// Flow demonstration
console.log('1. 📦 Module loading...');

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    console.log('3. 🧹 Cleanup running (dispose)');
  });
  
  import.meta.hot.accept(() => {
    console.log('4. 🔥 Update applied (accept)');
  });
}

console.log('2. ✅ Module loaded');

// On file change:
// 1. 📦 Module loading...
// 2. ✅ Module loaded
// (file is modified)
// 3. 🧹 Cleanup running (dispose)
// 4. 🔥 Update applied (accept)
// 1. 📦 Module loading...
// 2. ✅ Module loaded
```

## DOM Manipulation Cleanup

### Style Management Example

```javascript
// dynamic-styles.js
let currentStyleElement = null;

const themes = {
  dark: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: '1px solid #333'
  },
  light: {
    backgroundColor: '#ffffff', 
    color: '#000000',
    border: '1px solid #ddd'
  },
  colorful: {
    backgroundColor: '#ff6b6b',
    color: '#ffffff',
    border: '2px solid #ff5252'
  }
};

function createStyleSheet(themeName = 'dark') {
  const theme = themes[themeName] || themes.dark;
  
  const styleElement = document.createElement('style');
  styleElement.setAttribute('data-hmr-styles', 'true');
  
  styleElement.innerHTML = `
    body {
      background-color: ${theme.backgroundColor};
      color: ${theme.color};
      border: ${theme.border};
      transition: all 0.3s ease;
    }
    
    .container {
      padding: 20px;
      border-radius: 8px;
      margin: 20px;
    }
  `;
  
  return styleElement;
}

function applyTheme(themeName = 'dark') {
  // Remove existing styles first
  removeCurrentStyles();
  
  // Apply new styles
  currentStyleElement = createStyleSheet(themeName);
  document.head.appendChild(currentStyleElement);
  
  console.log(`🎨 Applied ${themeName} theme`);
}

function removeCurrentStyles() {
  // Remove our specific styles
  if (currentStyleElement) {
    currentStyleElement.remove();
    currentStyleElement = null;
  }
  
  // Alternative: Remove all HMR styles
  const hmrStyles = document.querySelectorAll('[data-hmr-styles]');
  hmrStyles.forEach(style => style.remove());
  
  console.log('🧹 Removed previous styles');
}

// Apply initial theme
applyTheme('colorful'); // Change this to test different themes

if (import.meta.hot) {
  // Cleanup before updates
  import.meta.hot.dispose(() => {
    removeCurrentStyles();
  });
  
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔄 Theme module updated');
    }
  });
}
```

### Event Listener Cleanup

```javascript
// event-handlers.js
let eventListeners = [];
let intervalIds = [];
let timeoutIds = [];

function addEventListeners() {
  // Click handler
  const clickHandler = (e) => {
    console.log('🖱️ Click detected:', e.target.tagName);
  };
  
  document.addEventListener('click', clickHandler);
  eventListeners.push({ element: document, event: 'click', handler: clickHandler });
  
  // Keydown handler  
  const keyHandler = (e) => {
    console.log('⌨️ Key pressed:', e.key);
  };
  
  document.addEventListener('keydown', keyHandler);
  eventListeners.push({ element: document, event: 'keydown', handler: keyHandler });
  
  console.log('👂 Event listeners added');
}

function addTimers() {
  // Interval
  const intervalId = setInterval(() => {
    console.log('⏰ Interval tick:', new Date().toLocaleTimeString());
  }, 3000);
  intervalIds.push(intervalId);
  
  // Timeout
  const timeoutId = setTimeout(() => {
    console.log('⏲️ Timeout executed');
  }, 5000);
  timeoutIds.push(timeoutId);
  
  console.log('⏰ Timers started');
}

function cleanup() {
  // Remove event listeners
  eventListeners.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
  eventListeners = [];
  
  // Clear intervals
  intervalIds.forEach(id => clearInterval(id));
  intervalIds = [];
  
  // Clear timeouts
  timeoutIds.forEach(id => clearTimeout(id));
  timeoutIds = [];
  
  console.log('🧹 All cleanup completed');
}

// Initialize
addEventListeners();
addTimers();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanup();
  });
  
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔄 Event handlers module updated');
    }
  });
}
```

### Local Storage Cleanup

```javascript
// storage-manager.js
const STORAGE_PREFIX = 'hmr-demo-';
const storageKeys = [];

function setStorageItem(key, value) {
  const fullKey = `${STORAGE_PREFIX}${key}`;
  localStorage.setItem(fullKey, JSON.stringify(value));
  storageKeys.push(fullKey);
  console.log(`💾 Stored: ${key} =`, value);
}

function getStorageItem(key) {
  const fullKey = `${STORAGE_PREFIX}${key}`;
  const item = localStorage.getItem(fullKey);
  return item ? JSON.parse(item) : null;
}

function clearHMRStorage() {
  storageKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  storageKeys.length = 0;
  console.log('🧹 Cleared HMR storage');
}

// Initialize some data
setStorageItem('user', { name: 'John', theme: 'dark' });
setStorageItem('settings', { notifications: true, autoSave: false });
setStorageItem('cache', { timestamp: Date.now() });

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    clearHMRStorage();
  });
  
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔄 Storage manager updated');
    }
  });
}
```

## HMR Event System

### Standard HMR Events

Vite provides several built-in HMR events you can listen to:

```javascript
// hmr-events.js
console.log('📦 Setting up HMR event listeners');

if (import.meta.hot) {
  // Before any update is applied
  import.meta.hot.on('vite:beforeUpdate', (data) => {
    console.log('🔄 Before Update:', {
      type: data.type,
      path: data.path,
      timestamp: new Date(data.timestamp).toLocaleTimeString()
    });
  });
  
  // After update is applied
  import.meta.hot.on('vite:afterUpdate', (data) => {
    console.log('✅ After Update:', {
      type: data.type,
      path: data.path,
      timestamp: new Date(data.timestamp).toLocaleTimeString()
    });
  });
  
  // When an error occurs during update
  import.meta.hot.on('vite:error', (data) => {
    console.error('❌ HMR Error:', {
      type: data.type,
      err: data.err.message,
      id: data.id,
      loc: data.err.loc
    });
  });
  
  // Before full page reload
  import.meta.hot.on('vite:beforeFullReload', () => {
    console.warn('🔄 Full page reload incoming...');
  });
  
  // WebSocket connection events
  import.meta.hot.on('vite:ws:connect', (data) => {
    console.log('🔌 WebSocket connected:', data);
  });
  
  import.meta.hot.on('vite:ws:disconnect', (data) => {
    console.warn('🔌 WebSocket disconnected:', data);
  });
}

// Add some content that can be modified
export const config = {
  version: '1.0.0',
  environment: 'development',
  features: ['hmr', 'hot-reload', 'websocket']
};

console.log('📄 Module loaded with config:', config);
```

### Custom Event Handling

```javascript
// custom-hmr-events.js
let updateCount = 0;
let errorCount = 0;

if (import.meta.hot) {
  // Track update statistics
  import.meta.hot.on('vite:beforeUpdate', (data) => {
    updateCount++;
    console.log(`📊 Update #${updateCount} starting for: ${data.path}`);
    
    // Show loading indicator
    showLoadingIndicator();
  });
  
  import.meta.hot.on('vite:afterUpdate', (data) => {
    console.log(`📊 Update #${updateCount} completed for: ${data.path}`);
    
    // Hide loading indicator
    hideLoadingIndicator();
    
    // Show success notification
    showNotification(`Update ${updateCount} applied successfully`, 'success');
  });
  
  import.meta.hot.on('vite:error', (data) => {
    errorCount++;
    console.error(`💥 Error #${errorCount}:`, data.err.message);
    
    // Show error notification
    showNotification(`HMR Error: ${data.err.message}`, 'error');
    
    // Hide loading indicator
    hideLoadingIndicator();
  });
}

function showLoadingIndicator() {
  let indicator = document.getElementById('hmr-loading');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'hmr-loading';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #0066cc;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
    `;
    indicator.textContent = '🔄 Updating...';
    document.body.appendChild(indicator);
  }
  indicator.style.display = 'block';
}

function hideLoadingIndicator() {
  const indicator = document.getElementById('hmr-loading');
  if (indicator) {
    indicator.style.display = 'none';
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 50px;
    right: 10px;
    background: ${type === 'error' ? '#cc0000' : '#00cc66'};
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    max-width: 300px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Export something to modify for testing
export const status = {
  updates: updateCount,
  errors: errorCount,
  lastUpdate: Date.now()
};
```

## Complete Examples

### Example 1: Dynamic Component with Full Cleanup

```javascript
// dynamic-component.js
let componentInstance = null;
let componentContainer = null;
let componentTimer = null;

class SimpleComponent {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      title: 'Dynamic Component',
      color: '#007acc',
      updateInterval: 1000,
      ...options
    };
    
    this.element = null;
    this.timer = null;
    this.eventListeners = [];
    
    this.init();
  }
  
  init() {
    this.createElement();
    this.attachEvents();
    this.startTimer();
    console.log('🚀 Component initialized');
  }
  
  createElement() {
    this.element = document.createElement('div');
    this.element.style.cssText = `
      background: ${this.options.color};
      color: white;
      padding: 20px;
      margin: 10px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
    `;
    
    this.updateContent();
    this.container.appendChild(this.element);
  }
  
  updateContent() {
    if (this.element) {
      this.element.innerHTML = `
        <h3>${this.options.title}</h3>
        <p>Last updated: ${new Date().toLocaleTimeString()}</p>
        <p>Update interval: ${this.options.updateInterval}ms</p>
        <button class="component-button">Click me!</button>
      `;
    }
  }
  
  attachEvents() {
    if (this.element) {
      const button = this.element.querySelector('.component-button');
      const clickHandler = () => {
        alert(`Hello from ${this.options.title}!`);
      };
      
      button.addEventListener('click', clickHandler);
      this.eventListeners.push({ element: button, event: 'click', handler: clickHandler });
    }
  }
  
  startTimer() {
    this.timer = setInterval(() => {
      this.updateContent();
    }, this.options.updateInterval);
  }
  
  destroy() {
    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // Remove event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
    
    // Remove DOM element
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
    
    console.log('💥 Component destroyed');
  }
}

// Initialize component
function initComponent() {
  componentContainer = document.getElementById('app') || document.body;
  
  componentInstance = new SimpleComponent(componentContainer, {
    title: 'HMR Test Component',
    color: '#ff6b6b', // Change this color to test HMR
    updateInterval: 2000
  });
}

// Initialize on load
initComponent();

if (import.meta.hot) {
  // Cleanup before updates
  import.meta.hot.dispose(() => {
    if (componentInstance) {
      componentInstance.destroy();
      componentInstance = null;
    }
  });
  
  // Accept updates and reinitialize
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔄 Component module updated - reinitializing...');
      // Component will be reinitialized due to module re-execution
    }
  });
}
```

### Example 2: State Management with HMR Data

```javascript
// state-with-hmr-data.js
let applicationState = {
  user: null,
  theme: 'light',
  notifications: [],
  sessionStart: Date.now()
};

let stateSubscribers = [];

// State management functions
function getState() {
  return { ...applicationState };
}

function setState(newState) {
  const prevState = { ...applicationState };
  applicationState = { ...applicationState, ...newState };
  
  // Notify subscribers
  stateSubscribers.forEach(subscriber => {
    subscriber(applicationState, prevState);
  });
  
  console.log('🔄 State updated:', applicationState);
}

function subscribe(callback) {
  stateSubscribers.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = stateSubscribers.indexOf(callback);
    if (index > -1) {
      stateSubscribers.splice(index, 1);
    }
  };
}

// Example subscriber
const unsubscribe = subscribe((newState, prevState) => {
  console.log('📡 State changed:', {
    old: prevState,
    new: newState
  });
});

// Initialize with some data
setState({
  user: { name: 'John', email: 'john@example.com' },
  theme: 'dark',
  notifications: ['Welcome!', 'HMR is active']
});

if (import.meta.hot) {
  // Restore state from HMR data
  if (import.meta.hot.data.applicationState) {
    applicationState = import.meta.hot.data.applicationState;
    console.log('🔄 State restored from HMR data');
  }
  
  // Save state before disposal
  import.meta.hot.dispose((data) => {
    data.applicationState = applicationState;
    console.log('💾 State saved to HMR data');
    
    // Cleanup subscribers
    stateSubscribers = [];
  });
  
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔄 State module updated - state preserved!');
    }
  });
}

// Export for external use
export { getState, setState, subscribe };
```

## Best Practices

### 1. Always Implement dispose()

```javascript
// ✅ Good - Always clean up
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Cleanup code here
    removeDOMElements();
    clearTimers();
    removeEventListeners();
  });
}

// ❌ Bad - No cleanup
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    // Only accepts updates, no cleanup
  });
}
```

### 2. Use Data Attributes for Tracking

```javascript
// ✅ Good - Trackable elements
const element = document.createElement('div');
element.setAttribute('data-hmr-component', 'my-component');
element.setAttribute('data-hmr-id', generateId());

// Cleanup by attribute
const hmrElements = document.querySelectorAll('[data-hmr-component="my-component"]');
hmrElements.forEach(el => el.remove());
```

### 3. Preserve Important State

```javascript
// ✅ Good - State preservation
if (import.meta.hot) {
  // Restore previous state
  if (import.meta.hot.data.userState) {
    currentUser = import.meta.hot.data.userState;
  }
  
  import.meta.hot.dispose((data) => {
    data.userState = currentUser;
  });
}
```

### 4. Use Proper Error Boundaries

```javascript
// ✅ Good - Error handling
if (import.meta.hot) {
  import.meta.hot.on('vite:error', (data) => {
    console.error('HMR Error:', data);
    // Show user-friendly error message
    showErrorNotification('Development error occurred');
  });
  
  import.meta.hot.dispose(() => {
    try {
      cleanup();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });
}
```

### 5. Organize Cleanup Functions

```javascript
// ✅ Good - Organized cleanup
const cleanupTasks = [];

function addCleanupTask(task) {
  cleanupTasks.push(task);
}

function runAllCleanup() {
  cleanupTasks.forEach(task => {
    try {
      task();
    } catch (error) {
      console.error('Cleanup task failed:', error);
    }
  });
  cleanupTasks.length = 0;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    runAllCleanup();
  });
}

// Usage
addCleanupTask(() => clearInterval(timerId));
addCleanupTask(() => element.remove());
addCleanupTask(() => removeEventListeners());
```

## Advanced Patterns

### Conditional HMR Based on Environment

```javascript
// hmr-conditional.js
const isDevelopment = import.meta.env.DEV;
const isHMREnabled = import.meta.hot && isDevelopment;

if (isHMREnabled) {
  console.log('🔥 Advanced HMR enabled');
  
  // Only in development with HMR
  import.meta.hot.dispose(() => {
    console.log('🧹 Development cleanup');
  });
  
  import.meta.hot.accept(() => {
    console.log('🔄 Development update');
  });
} else {
  console.log('📦 Production mode or HMR disabled');
}
```

### Module Federation with HMR

```javascript
// federated-module.js
let federatedComponents = new Map();

function registerComponent(name, component) {
  federatedComponents.set(name, component);
  console.log(`📦 Registered component: ${name}`);
}

function getComponent(name) {
  return federatedComponents.get(name);
}

if (import.meta.hot) {
  // Preserve registered components
  if (import.meta.hot.data.federatedComponents) {
    federatedComponents = import.meta.hot.data.federatedComponents;
  }
  
  import.meta.hot.dispose((data) => {
    data.federatedComponents = federatedComponents;
  });
  
  import.meta.hot.accept(() => {
    console.log('🔄 Federated module updated');
  });
}
```

## Troubleshooting

### Common Issues and Solutions

1. **Memory Leaks**
```javascript
// Problem: Event listeners not removed
document.addEventListener('click', handler); // Never removed

// Solution: Track and remove
const eventCleanup = [];
document.addEventListener('click', handler);
eventCleanup.push(() => document.removeEventListener('click', handler));

import.meta.hot.dispose(() => {
  eventCleanup.forEach(cleanup => cleanup());
});
```

2. **DOM Elements Accumulating**
```javascript
// Problem: Elements never removed
document.body.appendChild(element);

// Solution: Track and remove
const elements = [];
const element = document.createElement('div');
document.body.appendChild(element);
elements.push(element);

import.meta.hot.dispose(() => {
  elements.forEach(el => el.remove());
});
```

3. **dispose() Not Running**
```javascript
// Problem: dispose outside HMR check
import.meta.hot.dispose(() => {
  // This won't work!
});

// Solution: Inside HMR check
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // This works!
  });
}
```

This comprehensive guide covers all aspects of advanced HMR usage, from basic cleanup to sophisticated state management and error handling patterns.