# Vite Hot Module Replacement (HMR) for Custom Plugins

## Course Overview
This guide covers implementing Hot Module Replacement (HMR) in custom Vite plugins, using a CSV import plugin as a practical example. Learn how to create seamless development experiences by updating modules without full page refreshes.

## Prerequisites
- Understanding of Vite plugin development
- Basic knowledge of JavaScript ES modules
- Familiarity with WebSocket communication
- Node.js and npm/yarn installed

## Table of Contents
1. [Introduction to Hot Module Replacement](#introduction-to-hot-module-replacement)
2. [Understanding the Problem](#understanding-the-problem)
3. [Basic Plugin Implementation](#basic-plugin-implementation)
4. [Server-Side HMR Implementation](#server-side-hmr-implementation)
5. [Client-Side HMR Implementation](#client-side-hmr-implementation)
6. [Complete Implementation](#complete-implementation)
7. [Testing and Verification](#testing-and-verification)
8. [Advanced Concepts](#advanced-concepts)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 1. Introduction to Hot Module Replacement

### What is HMR?
Hot Module Replacement (HMR) is a development feature that allows modules to be updated at runtime without a full page refresh, preserving application state.

### Benefits of HMR
- **Faster development** - No page refreshes
- **State preservation** - Variables and component state remain intact
- **Better developer experience** - Instant feedback
- **Efficient workflow** - Focus on code, not page reloads

### How HMR Works in Vite
1. **File watcher** detects changes
2. **Plugin processes** the change
3. **WebSocket connection** sends updates
4. **Client receives** and applies changes
5. **Module gets updated** without page refresh

---

## 2. Understanding the Problem

### Without HMR
When files are modified, Vite performs a full page refresh:

```javascript
// Before modification - variable exists
const pluginConstant = "I will be lost on refresh";

// After CSV file change - full page refresh occurs
// pluginConstant becomes undefined
console.log(pluginConstant); // undefined
```

### The Goal
Implement HMR so that:
- File changes trigger module updates
- Page state is preserved
- No full page refresh occurs
- Content updates instantly

---

## 3. Basic Plugin Implementation

### Initial Plugin Structure
```javascript
// vite-plugin-csv.js
import fs from 'fs';
import path from 'path';

export function csv() {
  return {
    name: 'csv-plugin',
    transform(code, id) {
      // Only process CSV files
      if (!id.endsWith('.csv')) {
        return null;
      }

      // Read and parse CSV content
      const csvContent = fs.readFileSync(id, 'utf-8');
      const parsedData = parseCSV(csvContent);
      
      // Return as ES module
      return `export default ${JSON.stringify(parsedData)};`;
    }
  };
}

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });
    return obj;
  });
}
```

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { csv } from './vite-plugin-csv.js';

export default defineConfig({
  plugins: [csv()]
});
```

### Usage Example
```javascript
// main.js
import products from './products.csv';

console.log(products); // Array of product objects

// Display products
const pre = document.querySelector('pre');
pre.textContent = JSON.stringify(products, null, 2);
```

### Sample CSV File
```csv
name,price,category
Laptop,999,Electronics
Phone,599,Electronics
Desk,299,Furniture
Chair,199,Furniture
```

---

## 4. Server-Side HMR Implementation

### Adding the handleHotUpdate Hook
```javascript
// vite-plugin-csv.js (enhanced version)
import fs from 'fs';

export function csv() {
  return {
    name: 'csv-plugin',
    
    transform(code, id) {
      if (!id.endsWith('.csv')) {
        return null;
      }

      const csvContent = fs.readFileSync(id, 'utf-8');
      const parsedData = parseCSV(csvContent);
      
      return `export default ${JSON.stringify(parsedData)};`;
    },

    // HMR Hook - handles hot updates
    async handleHotUpdate(context) {
      // Only handle CSV files
      if (!context.file.endsWith('.csv')) {
        return;
      }

      // Read updated file content
      const updatedContent = await context.read();
      
      // Parse CSV content
      const parsedData = parseCSV(updatedContent);

      // Send custom event via WebSocket
      context.server.ws.send({
        type: 'custom',
        event: 'csv-update',
        data: {
          url: context.file,
          data: parsedData
        }
      });

      // Return empty array to prevent default HMR
      return [];
    }
  };
}

function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index]?.trim() || '';
    });
    return obj;
  });
}
```

### Key Components Explained

#### handleHotUpdate Hook
```javascript
async handleHotUpdate(context) {
  // context contains:
  // - file: path to the modified file
  // - read(): method to read file content
  // - server: Vite dev server instance
  // - modules: affected modules
}
```

#### WebSocket Communication
```javascript
context.server.ws.send({
  type: 'custom',        // Custom event type
  event: 'csv-update',   // Event name for client
  data: {                // Payload data
    url: context.file,   // File path
    data: parsedData     // Processed content
  }
});
```

#### Preventing Default HMR
```javascript
return []; // Empty array tells Vite we handled the update
```

---

## 5. Client-Side HMR Implementation

### Basic Client Setup
```javascript
// main.js
import products from './products.csv';

// Display initial data
function updateDisplay(data) {
  const pre = document.querySelector('pre');
  pre.textContent = JSON.stringify(data, null, 2);
}

// Initial render
updateDisplay(products);

// HMR setup - only in development
if (import.meta.hot) {
  // Listen for custom CSV updates
  import.meta.hot.on('csv-update', (data) => {
    console.log('CSV file updated:', data.url);
    console.log('New data:', data.data);
    
    // Update the display with new data
    updateDisplay(data.data);
  });
}
```

### Advanced Client Implementation
```javascript
// main.js (enhanced version)
import products from './products.csv';

// State management
let currentProducts = products;
const pluginConstant = "This should persist through updates";

// Display function
function renderProducts(data) {
  const container = document.querySelector('#products');
  container.innerHTML = data.map(product => `
    <div class="product">
      <h3>${product.name}</h3>
      <p>Price: $${product.price}</p>
      <p>Category: ${product.category}</p>
    </div>
  `).join('');
  
  // Show that state persists
  console.log('Plugin constant still exists:', pluginConstant);
}

// Initial render
renderProducts(currentProducts);

// HMR Configuration
if (import.meta.hot) {
  import.meta.hot.on('csv-update', ({ url, data }) => {
    console.log(`Module updated: ${url}`);
    console.log('State preserved:', pluginConstant !== undefined);
    
    // Update current data
    currentProducts = data;
    
    // Re-render with new data
    renderProducts(currentProducts);
    
    // Optional: Accept the update explicitly
    import.meta.hot.accept();
  });
}
```

### HMR API Methods
```javascript
if (import.meta.hot) {
  // Accept updates for this module
  import.meta.hot.accept();
  
  // Accept updates with callback
  import.meta.hot.accept((newModule) => {
    console.log('Module updated:', newModule);
  });
  
  // Listen to custom events
  import.meta.hot.on('custom-event', (data) => {
    // Handle custom event
  });
  
  // Dispose callback - cleanup before update
  import.meta.hot.dispose((data) => {
    // Store state before update
    data.myState = currentState;
  });
  
  // Prune callback - called when module is no longer imported
  import.meta.hot.prune((data) => {
    // Cleanup resources
  });
}
```

---

## 6. Complete Implementation

### Full Plugin Code
```javascript
// vite-plugin-csv.js
import fs from 'fs';
import path from 'path';

export function csv(options = {}) {
  const { 
    delimiter = ',',
    skipEmptyLines = true,
    trimHeaders = true 
  } = options;

  return {
    name: 'csv-plugin',
    
    // Transform hook - processes CSV files
    transform(code, id) {
      if (!id.endsWith('.csv')) {
        return null;
      }

      try {
        const csvContent = fs.readFileSync(id, 'utf-8');
        const parsedData = parseCSV(csvContent, { 
          delimiter, 
          skipEmptyLines, 
          trimHeaders 
        });
        
        // Return as ES module with default export
        return {
          code: `export default ${JSON.stringify(parsedData, null, 2)};`,
          map: null // No source map needed for data files
        };
      } catch (error) {
        this.error(`Failed to parse CSV file ${id}: ${error.message}`);
      }
    },

    // HMR hook - handles hot updates
    async handleHotUpdate(context) {
      const { file, server, read } = context;
      
      // Only process CSV files
      if (!file.endsWith('.csv')) {
        return;
      }

      try {
        // Read the updated file content
        const updatedContent = await read();
        
        // Parse the new CSV content
        const parsedData = parseCSV(updatedContent, { 
          delimiter, 
          skipEmptyLines, 
          trimHeaders 
        });

        // Send custom update event to client
        server.ws.send({
          type: 'custom',
          event: 'csv-update',
          data: {
            url: file,
            data: parsedData,
            timestamp: Date.now()
          }
        });

        // Return empty array to prevent default HMR behavior
        return [];
      } catch (error) {
        // Send error to client
        server.ws.send({
          type: 'error',
          err: {
            message: `CSV Parse Error: ${error.message}`,
            stack: error.stack
          }
        });
        return [];
      }
    }
  };
}

// CSV parsing utility
function parseCSV(content, options = {}) {
  const { delimiter = ',', skipEmptyLines = true, trimHeaders = true } = options;
  
  if (!content.trim()) {
    return [];
  }

  const lines = content.trim().split('\n');
  
  if (lines.length === 0) {
    return [];
  }

  // Parse headers
  let headers = lines[0].split(delimiter);
  if (trimHeaders) {
    headers = headers.map(header => header.trim());
  }

  // Parse data rows
  const dataRows = lines.slice(1);
  const result = [];

  for (let i = 0; i < dataRows.length; i++) {
    const line = dataRows[i];
    
    if (skipEmptyLines && !line.trim()) {
      continue;
    }

    const values = line.split(delimiter);
    const row = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      row[header] = value ? value.trim() : '';
    });
    
    result.push(row);
  }

  return result;
}
```

### Complete Client Implementation
```javascript
// main.js
import products from './products.csv';

// Application state
let currentData = products;
const appState = {
  selectedCategory: 'all',
  sortBy: 'name',
  // This state will persist through HMR updates
  userPreferences: { theme: 'dark' }
};

// Utility functions
function filterProducts(products, category) {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
    if (sortBy === 'price') {
      return parseFloat(a.price) - parseFloat(b.price);
    }
    return a[sortBy].localeCompare(b[sortBy]);
  });
}

// Render functions
function renderProducts(products) {
  const filtered = filterProducts(products, appState.selectedCategory);
  const sorted = sortProducts(filtered, appState.sortBy);
  
  const container = document.querySelector('#products');
  container.innerHTML = sorted.map(product => `
    <div class="product-card">
      <h3>${product.name}</h3>
      <p class="price">$${product.price}</p>
      <p class="category">${product.category}</p>
    </div>
  `).join('');
  
  // Update stats
  document.querySelector('#total-products').textContent = products.length;
  document.querySelector('#filtered-products').textContent = sorted.length;
}

function renderControls() {
  const categories = ['all', ...new Set(currentData.map(p => p.category))];
  const categorySelect = document.querySelector('#category-filter');
  
  categorySelect.innerHTML = categories.map(cat => 
    `<option value="${cat}" ${cat === appState.selectedCategory ? 'selected' : ''}>${cat}</option>`
  ).join('');
}

// Event listeners
function setupEventListeners() {
  document.querySelector('#category-filter').addEventListener('change', (e) => {
    appState.selectedCategory = e.target.value;
    renderProducts(currentData);
  });
  
  document.querySelector('#sort-select').addEventListener('change', (e) => {
    appState.sortBy = e.target.value;
    renderProducts(currentData);
  });
}

// Initialize application
function initApp() {
  renderControls();
  renderProducts(currentData);
  setupEventListeners();
}

// Initial render
initApp();

// HMR Setup
if (import.meta.hot) {
  console.log('HMR enabled for CSV files');
  
  // Store state before updates
  import.meta.hot.dispose((data) => {
    data.appState = appState;
    console.log('State stored before HMR update');
  });
  
  // Restore state after updates
  if (import.meta.hot.data.appState) {
    Object.assign(appState, import.meta.hot.data.appState);
    console.log('State restored after HMR update');
  }
  
  // Listen for CSV updates
  import.meta.hot.on('csv-update', ({ url, data, timestamp }) => {
    console.log(`CSV updated: ${url} at ${new Date(timestamp).toLocaleTimeString()}`);
    console.log('New data:', data);
    console.log('App state preserved:', appState);
    
    // Update data
    currentData = data;
    
    // Re-render with preserved state
    renderControls();
    renderProducts(currentData);
    
    // Show success notification
    showNotification('CSV file updated successfully!');
  });
  
  // Handle errors
  import.meta.hot.on('vite:error', (error) => {
    console.error('HMR Error:', error);
    showNotification('Error updating CSV file: ' + error.message, 'error');
  });
}

// Utility for notifications
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
```

---

## 7. Testing and Verification

### Test Scenarios

#### Basic Functionality Test
```javascript
// Test 1: Verify initial load
console.log('Test 1: Initial data load');
console.log('Products loaded:', currentData.length);

// Test 2: State persistence
const testConstant = 'This should persist';
console.log('Test constant defined:', testConstant);
```

#### HMR Test Process
1. **Setup test constant**
   ```javascript
   const hmrTest = {
     startTime: Date.now(),
     updateCount: 0
   };
   ```

2. **Modify CSV file**
   ```csv
   name,price,category
   Laptop,999,Electronics
   Phone,599,Electronics
   Tablet,399,Electronics  # Add this line
   ```

3. **Verify results**
   - Check console for HMR messages
   - Verify `testConstant` still exists
   - Confirm new data appears on page
   - Ensure no page refresh occurred

### Testing Commands
```bash
# Start development server
npm run dev

# In separate terminal, modify CSV files
echo "NewProduct,199,Test" >> products.csv

# Check browser console for HMR messages
# Verify page content updates without refresh
```

### Debugging HMR Issues
```javascript
// Add debug logging to plugin
async handleHotUpdate(context) {
  console.log('HMR triggered for:', context.file);
  console.log('File exists:', fs.existsSync(context.file));
  
  // ... rest of implementation
}

// Add debug logging to client
if (import.meta.hot) {
  import.meta.hot.on('csv-update', (data) => {
    console.group('HMR Update');
    console.log('File:', data.url);
    console.log('Data length:', data.data.length);
    console.log('Timestamp:', new Date(data.timestamp));
    console.groupEnd();
  });
}
```

---

## 8. Advanced Concepts

### Conditional HMR Updates
```javascript
// Plugin: Smart updates based on file size
async handleHotUpdate(context) {
  const stats = fs.statSync(context.file);
  
  // Skip HMR for very large files
  if (stats.size > 1024 * 1024) { // 1MB
    console.warn('File too large for HMR, triggering full refresh');
    return; // Let Vite handle with full refresh
  }
  
  // Continue with HMR for smaller files
  // ... rest of implementation
}
```

### Error Recovery
```javascript
// Plugin: Handle parsing errors gracefully
async handleHotUpdate(context) {
  try {
    const content = await context.read();
    const data = parseCSV(content);
    
    context.server.ws.send({
      type: 'custom',
      event: 'csv-update',
      data: { url: context.file, data, error: null }
    });
  } catch (error) {
    // Send error but don't break HMR
    context.server.ws.send({
      type: 'custom',
      event: 'csv-update',
      data: { url: context.file, data: null, error: error.message }
    });
  }
  
  return [];
}
```

### Batched Updates
```javascript
// Plugin: Batch multiple rapid changes
let updateTimeout;

async handleHotUpdate(context) {
  // Clear previous timeout
  clearTimeout(updateTimeout);
  
  // Batch updates within 100ms
  updateTimeout = setTimeout(async () => {
    const content = await context.read();
    const data = parseCSV(content);
    
    context.server.ws.send({
      type: 'custom',
      event: 'csv-update',
      data: { url: context.file, data }
    });
  }, 100);
  
  return [];
}
```

### Multi-file Dependencies
```javascript
// Handle updates to related files
async handleHotUpdate(context) {
  const relatedFiles = findRelatedCSVFiles(context.file);
  
  // Update all related files
  for (const file of relatedFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const data = parseCSV(content);
    
    context.server.ws.send({
      type: 'custom',
      event: 'csv-update',
      data: { url: file, data }
    });
  }
  
  return [];
}
```

---

## 9. Best Practices

### Performance Optimization
```javascript
// 1. Use efficient parsing
function parseCSV(content) {
  // Cache parsed results
  const cache = parseCSV.cache || (parseCSV.cache = new Map());
  const hash = hashString(content);
  
  if (cache.has(hash)) {
    return cache.get(hash);
  }
  
  const result = actualParseCSV(content);
  cache.set(hash, result);
  return result;
}

// 2. Limit cache size
if (cache.size > 100) {
  const firstKey = cache.keys().next().value;
  cache.delete(firstKey);
}
```

### Error Handling
```javascript
// Robust error handling
async handleHotUpdate(context) {
  try {
    // Validate file before processing
    await validateCSVFile(context.file);
    
    const content = await context.read();
    const data = parseCSV(content);
    
    // Validate parsed data
    if (!Array.isArray(data)) {
      throw new Error('Invalid CSV structure');
    }
    
    context.server.ws.send({
      type: 'custom',
      event: 'csv-update',
      data: { url: context.file, data, success: true }
    });
  } catch (error) {
    // Log error server-side
    console.error('CSV HMR Error:', error);
    
    // Send user-friendly error to client
    context.server.ws.send({
      type: 'custom',
      event: 'csv-error',
      data: { 
        url: context.file, 
        error: error.message,
        timestamp: Date.now()
      }
    });
  }
  
  return [];
}
```

### Memory Management
```javascript
// Client-side memory management
let dataCache = new Map();

if (import.meta.hot) {
  import.meta.hot.on('csv-update', ({ url, data }) => {
    // Limit cache size
    if (dataCache.size > 10) {
      const oldestKey = dataCache.keys().next().value;
      dataCache.delete(oldestKey);
    }
    
    // Store new data
    dataCache.set(url, data);
    updateDisplay(data);
  });
  
  // Cleanup on dispose
  import.meta.hot.dispose(() => {
    dataCache.clear();
  });
}
```

### Development vs Production
```javascript
// Environment-specific behavior
export function csv(options = {}) {
  return {
    name: 'csv-plugin',
    
    transform(code, id) {
      // Always transform CSV files
      if (!id.endsWith('.csv')) return null;
      
      const data = parseCSV(fs.readFileSync(id, 'utf-8'));
      return `export default ${JSON.stringify(data)};`;
    },
    
    // Only add HMR in development
    ...(process.env.NODE_ENV === 'development' && {
      async handleHotUpdate(context) {
        // HMR implementation only in dev
        // ...
      }
    })
  };
}
```

---

## 10. Troubleshooting

### Common Issues and Solutions

#### HMR Not Triggering
```javascript
// Issue: handleHotUpdate not called
// Solution: Check file extension matching
if (!context.file.endsWith('.csv')) {
  return; // Should be return undefined, not return []
}

// Issue: Wrong return value
return []; // Correct - prevents default HMR
return undefined; // Wrong - allows default HMR
```

#### WebSocket Connection Issues
```javascript
// Debug WebSocket connection
if (import.meta.hot) {
  console.log('HMR available:', !!import.meta.hot);
  console.log('WebSocket state:', import.meta.hot.ws?.readyState);
  
  import.meta.hot.on('vite:ws:connect', () => {
    console.log('WebSocket connected');
  });
  
  import.meta.hot.on('vite:ws:disconnect', () => {
    console.log('WebSocket disconnected');
  });
}
```

#### State Not Persisting
```javascript
// Issue: State lost on updates
// Solution: Use dispose/accept pattern
if (import.meta.hot) {
  // Store state before update
  import.meta.hot.dispose((data) => {
    data.myState = currentState;
  });
  
  // Restore state after update
  if (import.meta.hot.data.myState) {
    currentState = import.meta.hot.data.myState;
  }
}
```

#### Error Handling
```javascript
// Comprehensive error handling
if (import.meta.hot) {
  import.meta.hot.on('csv-update', (data) => {
    try {
      if (data.error) {
        throw new Error(data.error);
      }
      updateDisplay(data.data);
    } catch (error) {
      console.error('HMR Update Error:', error);
      // Fallback to page refresh
      window.location.reload();
    }
  });
}
```

### Debug Tools
```javascript
// Development helper
window.debugHMR = {
  state: () => console.log('Current state:', appState),
  data: () => console.log('Current data:', currentData),
  trigger: (file) => {
    // Manually trigger HMR for testing
    if (import.meta.hot) {
      import.meta.hot.send('csv-update', { 
        url: file, 
        data: currentData 
      });
    }
  }
};
```

---

## Summary

### Key Takeaways
1. **HMR preserves state** during development updates
2. **Server-side hooks** detect and process file changes
3. **WebSocket communication** sends updates to clients
4. **Client-side listeners** apply updates without page refresh
5. **Error handling** ensures robust development experience

### Implementation Checklist
- [ ] Plugin implements `handleHotUpdate` hook
- [ ] File type validation (`.csv` extension)
- [ ] WebSocket event sending with custom event name
- [ ] Client-side event listener setup
- [ ] State preservation using dispose/accept pattern
- [ ] Error handling for parsing failures
- [ ] Performance optimization for large files
- [ ] Development vs production environment handling

### Essential Code Patterns
```javascript
// Server-side HMR hook
async handleHotUpdate(context) {
  if (!context.file.endsWith('.csv')) return;
  
  const data = await processFile(context);
  context.server.ws.send({
    type: 'custom',
    event: 'csv-update',
    data
  });
  
  return []; // Prevent default HMR
}

// Client-side HMR setup
if (import.meta.hot) {
  import.meta.hot.on('csv-update', (data) => {
    updateApplication(data);
  });
}
```

---

*This comprehensive guide provides everything needed to implement Hot Module Replacement in custom Vite plugins, ensuring a seamless development experience with instant updates and preserved application state.*