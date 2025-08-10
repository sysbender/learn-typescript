# Vite Hot Module Replacement for JavaScript Files Guide

## Overview

This guide covers implementing Hot Module Replacement (HMR) for JavaScript modules in Vite. You'll learn how to use the HMR API to enable real-time updates without full page refreshes, handle module dependencies, and implement robust error handling.

## Table of Contents

1. [HMR Fundamentals](#hmr-fundamentals)
2. [Basic Module Setup](#basic-module-setup)
3. [Self-Accepting Modules](#self-accepting-modules)
4. [Dependency Monitoring](#dependency-monitoring)
5. [Error Handling](#error-handling)
6. [Complete Examples](#complete-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## HMR Fundamentals

### What is Hot Module Replacement?

Hot Module Replacement allows modules to be updated in the browser without a full page refresh:

- **Development Only**: HMR is only available during development
- **Real-time Updates**: Changes reflect immediately in the browser
- **State Preservation**: Application state is maintained during updates
- **Performance**: Faster development cycle compared to full refreshes

### HMR API Basics

```javascript
// Check if HMR is available
if (import.meta.hot) {
  // HMR code here - removed in production builds
  console.log('HMR is available');
} else {
  console.log('Production build - no HMR');
}
```

### Key HMR Methods

```javascript
// Accept updates for current module
import.meta.hot.accept(callback);

// Accept updates for specific dependencies
import.meta.hot.accept(['./dependency.js'], callback);

// Accept updates for all dependencies
import.meta.hot.acceptDeps(['./dep1.js', './dep2.js'], callback);

// Decline updates (force full reload)
import.meta.hot.decline();
```

## Basic Module Setup

### Creating a Simple Module

```javascript
// module.js
export const message = 'Hello from module!';
export const data = { count: 1, active: true };

export default function greet(name) {
  return `Hello, ${name}!`;
}

// Add console.log to track module loading
console.log('📦 module.js loaded');

// HMR Implementation
if (import.meta.hot) {
  console.log('🔥 HMR available for module.js');
}
```

### Importing the Module

```javascript
// main.js
import greetFunction, { message, data } from './module.js';

console.log('📱 Application started');
console.log('Message:', message);
console.log('Data:', data);
console.log('Greeting:', greetFunction('World'));

// Comment out other code for this example
// Focus only on HMR implementation
```

## Self-Accepting Modules

### Basic Self-Acceptance

A self-accepting module handles its own updates:

```javascript
// module.js
export const message = 'Initial message';
export const config = { theme: 'dark', version: '1.0' };

export default function processData(input) {
  return `Processed: ${input}`;
}

console.log('🔄 Module executing...');

// Self-accepting HMR
if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    console.log('🔥 Module updated!');
    console.log('📄 Updated content:', updatedModule);
    
    // Access updated exports
    console.log('New message:', updatedModule.message);
    console.log('New config:', updatedModule.config);
    console.log('New function:', updatedModule.default);
  });
}
```

### HMR Flow Example

1. **Initial Load**:
```javascript
// Browser console output:
// 📦 module.js loaded
// 🔥 HMR available for module.js
```

2. **After Modification**:
```javascript
// Update module.js: change message to 'Updated message'
// Browser console output:
// 🔄 Module executing...
// 🔥 Module updated!
// 📄 Updated content: { message: 'Updated message', config: {...}, default: function }
```

### Without HMR (Full Refresh)

```javascript
// module.js - without HMR
export const message = 'Hello from module!';

console.log('📦 module.js loaded');

// No HMR code - results in full page refresh on changes
```

## Dependency Monitoring

### Watching Specific Dependencies

Monitor changes in imported modules:

```javascript
// submodule.js
export const subMessage = 'Hello from submodule!';
export const subData = { id: 1, status: 'active' };

export default function utilityFunction(value) {
  return `Utility: ${value}`;
}

console.log('📦 submodule.js loaded');
```

```javascript
// module.js
import subUtility, { subMessage, subData } from './submodule.js';

export const message = `Main: ${subMessage}`;
export const combinedData = { ...subData, mainFlag: true };

console.log('📦 module.js loaded');

if (import.meta.hot) {
  // Monitor specific dependencies
  import.meta.hot.accept(['./submodule.js'], ([updatedSubmodule]) => {
    console.log('📡 Submodule updated!');
    console.log('🔄 Updated submodule:', updatedSubmodule);
    
    // Handle the updated dependency
    if (updatedSubmodule) {
      console.log('New sub message:', updatedSubmodule.subMessage);
      console.log('New sub data:', updatedSubmodule.subData);
      console.log('New sub function:', updatedSubmodule.default);
    }
  });
}
```

### Multiple Dependencies

```javascript
// module.js
import { configA } from './moduleA.js';
import { configB } from './moduleB.js';
import { configC } from './moduleC.js';

console.log('📦 Main module loaded');

if (import.meta.hot) {
  // Monitor multiple dependencies
  import.meta.hot.accept([
    './moduleA.js',
    './moduleB.js', 
    './moduleC.js'
  ], (updatedModules) => {
    console.log('📡 Dependencies updated!');
    
    // updatedModules is an array matching the dependency order
    const [moduleA, moduleB, moduleC] = updatedModules;
    
    if (moduleA) {
      console.log('🅰️ Module A updated:', moduleA.configA);
    }
    
    if (moduleB) {
      console.log('🅱️ Module B updated:', moduleB.configB);
    }
    
    if (moduleC) {
      console.log('🆒 Module C updated:', moduleC.configC);
    }
  });
}
```

### Dependency Name Matching

Ensure exact filename matching:

```javascript
// ✅ Correct - exact filename
import.meta.hot.accept(['./submodule.js'], callback);

// ❌ Incorrect - typo in filename
import.meta.hot.accept(['./submodul.js'], callback); // Won't work!

// ✅ Correct - relative path matching
import.meta.hot.accept(['../utils/helper.js'], callback);

// ✅ Correct - multiple exact matches
import.meta.hot.accept([
  './moduleA.js',
  './moduleB.js'
], callback);
```

## Error Handling

### Handling Syntax Errors

```javascript
// module.js
export const data = { status: 'working' };

if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    // Always check if updatedModule exists
    if (updatedModule) {
      console.log('✅ Valid update:', updatedModule);
      console.log('Data:', updatedModule.data);
    } else {
      console.warn('⚠️ Update failed - likely syntax error');
      // Don't try to access properties of undefined
    }
  });
}
```

### Robust Error Handling

```javascript
// module.js
export const config = { environment: 'development' };
export const utils = {
  formatData: (data) => `Formatted: ${data}`,
  validateInput: (input) => input != null
};

console.log('📦 Module loaded');

if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    try {
      if (!updatedModule) {
        console.error('❌ Module update failed - syntax error detected');
        return;
      }
      
      console.log('✅ Module updated successfully');
      
      // Safely access properties
      if (updatedModule.config) {
        console.log('🔧 New config:', updatedModule.config);
      }
      
      if (updatedModule.utils) {
        console.log('🛠️ New utils available');
        // Test new utilities
        console.log('Test format:', updatedModule.utils.formatData('test'));
      }
      
    } catch (error) {
      console.error('💥 Error handling module update:', error);
    }
  });
}
```

### Dependency Error Handling

```javascript
// module.js
if (import.meta.hot) {
  import.meta.hot.accept(['./dependency.js'], ([updatedDep]) => {
    // Check each dependency
    if (updatedDep) {
      try {
        console.log('📦 Dependency updated:', updatedDep);
        
        // Validate required exports exist
        if (typeof updatedDep.requiredFunction === 'function') {
          console.log('✅ Required function available');
        } else {
          console.warn('⚠️ Required function missing');
        }
        
      } catch (error) {
        console.error('💥 Error processing dependency update:', error);
      }
    } else {
      console.warn('⚠️ Dependency update failed - check for syntax errors');
    }
  });
}
```

## Complete Examples

### Example 1: State Management Module

```javascript
// state.js
let appState = {
  user: null,
  theme: 'light',
  notifications: [],
  lastUpdate: Date.now()
};

export function getState() {
  return { ...appState };
}

export function updateState(newState) {
  appState = { ...appState, ...newState, lastUpdate: Date.now() };
  console.log('🔄 State updated:', appState);
}

export function resetState() {
  appState = { user: null, theme: 'light', notifications: [], lastUpdate: Date.now() };
  console.log('🔄 State reset');
}

console.log('📦 State module loaded');

if (import.meta.hot) {
  // Preserve state during HMR
  if (import.meta.hot.data) {
    appState = import.meta.hot.data.appState || appState;
    console.log('🔄 State restored from HMR data');
  }
  
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔥 State module updated - preserving current state');
      console.log('Current state:', appState);
    }
  });
  
  // Store state before update
  import.meta.hot.dispose((data) => {
    data.appState = appState;
    console.log('💾 State saved for HMR');
  });
}
```

### Example 2: Configuration Module with Dependencies

```javascript
// config.js
export const defaultConfig = {
  apiUrl: 'http://localhost:3000',
  timeout: 5000,
  retries: 3
};

export default function createConfig(overrides = {}) {
  return { ...defaultConfig, ...overrides };
}

console.log('📦 Config module loaded');
```

```javascript
// api.js
import createConfig, { defaultConfig } from './config.js';

const apiConfig = createConfig({
  apiUrl: 'https://api.example.com'
});

export function fetchData(endpoint) {
  const url = `${apiConfig.apiUrl}/${endpoint}`;
  console.log(`🌐 Fetching from: ${url}`);
  return fetch(url);
}

export function getConfig() {
  return apiConfig;
}

console.log('📦 API module loaded with config:', apiConfig);

if (import.meta.hot) {
  // Watch for config changes
  import.meta.hot.accept(['./config.js'], ([updatedConfig]) => {
    if (updatedConfig) {
      console.log('⚙️ Configuration updated!');
      console.log('New default config:', updatedConfig.defaultConfig);
      
      // Recreate API config with new defaults
      const newApiConfig = updatedConfig.default({
        apiUrl: 'https://api.example.com'
      });
      
      console.log('🔄 API config updated:', newApiConfig);
      
      // You could update the local apiConfig here
      // apiConfig = newApiConfig;
    } else {
      console.warn('⚠️ Config update failed');
    }
  });
  
  // Handle self updates
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔥 API module updated!');
      console.log('Updated exports:', Object.keys(updatedModule));
    }
  });
}
```

### Example 3: Component-like Module

```javascript
// component.js
let componentState = {
  isActive: false,
  data: null,
  error: null
};

export function initComponent(container, options = {}) {
  componentState.isActive = true;
  
  const element = document.createElement('div');
  element.className = 'component';
  element.innerHTML = `
    <h3>Component Active</h3>
    <p>Options: ${JSON.stringify(options)}</p>
    <p>Last update: ${new Date().toLocaleTimeString()}</p>
  `;
  
  container.appendChild(element);
  
  console.log('🚀 Component initialized');
  return element;
}

export function destroyComponent() {
  componentState.isActive = false;
  console.log('💥 Component destroyed');
}

export function getComponentState() {
  return { ...componentState };
}

console.log('📦 Component module loaded');

if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      console.log('🔥 Component module updated!');
      
      // Re-initialize component if it was active
      if (componentState.isActive) {
        console.log('🔄 Re-initializing component...');
        
        // In a real scenario, you might:
        // 1. Get current component element
        // 2. Destroy current instance
        // 3. Initialize new version
        // 4. Preserve necessary state
        
        console.log('✅ Component hot-reloaded');
      }
    }
  });
  
  // Cleanup on disposal
  import.meta.hot.dispose(() => {
    if (componentState.isActive) {
      destroyComponent();
    }
  });
}
```

## Best Practices

### 1. Always Check for Undefined

```javascript
// ✅ Good - Check for validity
if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      // Safe to use updatedModule
      console.log('Updated:', updatedModule);
    } else {
      // Handle failed update (syntax error)
      console.warn('Update failed');
    }
  });
}
```

### 2. Use Descriptive Logging

```javascript
// ✅ Good - Clear, descriptive logs
console.log('📦 UserService module loaded');
console.log('🔥 UserService HMR updated - new methods:', Object.keys(updatedModule));

// ❌ Avoid - Unclear logs
console.log('loaded');
console.log('updated', updatedModule);
```

### 3. Handle State Preservation

```javascript
if (import.meta.hot) {
  // Restore state from previous version
  if (import.meta.hot.data.previousState) {
    currentState = import.meta.hot.data.previousState;
  }
  
  import.meta.hot.accept((updatedModule) => {
    if (updatedModule) {
      // Update logic but preserve state
      console.log('Module updated, state preserved');
    }
  });
  
  // Save state before disposal
  import.meta.hot.dispose((data) => {
    data.previousState = currentState;
  });
}
```

### 4. Validate Dependencies

```javascript
if (import.meta.hot) {
  import.meta.hot.accept(['./utils.js'], ([updatedUtils]) => {
    if (updatedUtils) {
      // Validate required exports
      const requiredMethods = ['formatData', 'validateInput', 'processResult'];
      const availableMethods = Object.keys(updatedUtils);
      
      const missingMethods = requiredMethods.filter(
        method => !availableMethods.includes(method)
      );
      
      if (missingMethods.length > 0) {
        console.error('❌ Missing required methods:', missingMethods);
      } else {
        console.log('✅ All required methods available');
      }
    }
  });
}
```

### 5. Use Try-Catch for Safety

```javascript
if (import.meta.hot) {
  import.meta.hot.accept((updatedModule) => {
    try {
      if (!updatedModule) return;
      
      // Potentially dangerous operations
      updateApplicationState(updatedModule);
      reinitializeComponents(updatedModule);
      
    } catch (error) {
      console.error('💥 HMR update failed:', error);
      // Could trigger full reload as fallback
      // window.location.reload();
    }
  });
}
```

## Troubleshooting

### Common Issues

1. **HMR Not Working**
```javascript
// Check if wrapped in conditional
if (import.meta.hot) {
  // HMR code must be here
}

// Verify Vite dev server is running
// npm run dev
```

2. **Dependency Not Found**
```javascript
// ❌ Wrong path
import.meta.hot.accept(['./wrongpath.js'], callback);

// ✅ Correct path - exact match with import
import.meta.hot.accept(['./correct-path.js'], callback);
```

3. **Syntax Errors Breaking HMR**
```javascript
// Always check for undefined
import.meta.hot.accept((updatedModule) => {
  if (updatedModule) {
    // Safe to use
  } else {
    console.warn('Syntax error in module');
  }
});
```

### Debugging Commands

```bash
# Start dev server with debug info
npm run dev -- --debug hmr

# Check Vite logs for HMR events
npm run dev -- --logLevel info

# Build production to verify HMR removal
npm run build
```

### Debug Logging

```javascript
if (import.meta.hot) {
  console.log('🔧 Debug: HMR available');
  console.log('🔧 Debug: Module path:', import.meta.url);
  
  import.meta.hot.accept((updatedModule) => {
    console.log('🔧 Debug: Update received');
    console.log('🔧 Debug: Module valid:', !!updatedModule);
    console.log('🔧 Debug: Exports:', updatedModule ? Object.keys(updatedModule) : 'none');
  });
}
```

## Testing HMR

### Development Workflow

1. **Start Development Server**
```bash
npm run dev
```

2. **Open Browser Console**
- Check for initial module load messages
- Verify HMR availability logs

3. **Make Changes**
- Edit module files
- Watch console for HMR updates
- Verify no full page refresh occurs

4. **Test Error Handling**
- Introduce syntax errors
- Verify graceful handling
- Fix errors and verify recovery

### Production Verification

```bash
# Build for production
npm run build

# Check that HMR code is removed
npm run preview
# Verify no HMR logs in console
```

This comprehensive guide provides everything needed to implement robust Hot Module Replacement for JavaScript files in Vite, from basic concepts to advanced error handling and state preservation techniques.