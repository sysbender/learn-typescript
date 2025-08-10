# Vite Client-Server WebSocket Communication Guide

## Overview

This guide covers how to establish client-server communication in Vite using WebSocket connections. You'll learn to create custom plugins that can exchange messages between the development server and client code, essential for features like Hot Module Replacement (HMR).

## Table of Contents

1. [Basic Concepts](#basic-concepts)
2. [Server-Side Implementation](#server-side-implementation)
3. [Client-Side Implementation](#client-side-implementation)
4. [Bidirectional Communication](#bidirectional-communication)
5. [Production Considerations](#production-considerations)
6. [Complete Example](#complete-example)
7. [Best Practices](#best-practices)

## Basic Concepts

### WebSocket in Vite Development
- Vite provides built-in WebSocket support for development servers
- Used primarily for Hot Module Replacement (HMR)
- Allows real-time communication between server and client
- Only available during development, not in production builds

### Key Hooks and Objects
- `handleHotUpdate`: Called when modules change (HMR-specific)
- `configureServer`: Hook to configure the development server
- `import.meta.hot`: Client-side API for HMR communication

## Server-Side Implementation

### Configure Server Hook

The `configureServer` hook allows you to access the server instance and set up WebSocket listeners:

```javascript
// vite-plugin-websocket.js
export default function websocketPlugin() {
  return {
    name: 'websocket-communication',
    configureServer(server) {
      // Access WebSocket connection through server.ws
      
      // Listen for connection events
      server.ws.on('connection', () => {
        console.log('WebSocket connection established');
        
        // Send event to client when connection is made
        server.ws.send('connected', {
          message: 'Connection established'
        });
      });
      
      // Listen for custom events from client
      server.ws.on('ping', (data, client) => {
        console.log('Received from client:', data.message);
        
        // Send response back to client
        client.send('pong', {
          message: 'Hello client'
        });
      });
    }
  };
}
```

### Server WebSocket API

```javascript
// Send event to all connected clients
server.ws.send('eventName', payload);

// Listen for events from clients
server.ws.on('eventName', (data, client) => {
  // data: payload sent from client
  // client: specific client connection object
  
  // Send response to specific client
  client.send('responseEvent', responsePayload);
});
```

### Built-in Events

```javascript
// Connection event - fired when WebSocket connects
server.ws.on('connection', () => {
  // Handle new connections
});

// You can create custom events
server.ws.on('custom-event-name', (data, client) => {
  // Handle custom events
});
```

## Client-Side Implementation

### Hot Module Replacement API

Access WebSocket functionality through `import.meta.hot`:

```javascript
// client.js
if (import.meta.hot) {
  // Listen for events from server
  import.meta.hot.on('connected', (data) => {
    console.log('Server message:', data.message);
    
    // Send response to server
    import.meta.hot.send('ping', {
      message: 'Hello server'
    });
  });
  
  // Listen for server responses
  import.meta.hot.on('pong', (data) => {
    console.log('Server response:', data.message);
  });
  
  // Optional: Add debugging
  console.log('HMR WebSocket available');
}
```

### Client-Side API Methods

```javascript
// Send event to server
import.meta.hot.send('eventName', payload);

// Listen for events from server
import.meta.hot.on('eventName', (data) => {
  // Handle received data
});

// Remove event listener
import.meta.hot.off('eventName', handlerFunction);

// Check if HMR is available
if (import.meta.hot) {
  // HMR code here
}
```

## Bidirectional Communication

### Complete Flow Example

1. **Server establishes connection:**
```javascript
// Plugin code
configureServer(server) {
  server.ws.on('connection', () => {
    server.ws.send('connected', { message: 'Connection established' });
  });
}
```

2. **Client receives and responds:**
```javascript
// Client code
if (import.meta.hot) {
  import.meta.hot.on('connected', (data) => {
    console.log(data.message); // "Connection established"
    
    // Send ping to server
    import.meta.hot.send('ping', { message: 'Hello server' });
  });
}
```

3. **Server handles client message:**
```javascript
// Plugin code
server.ws.on('ping', (data, client) => {
  console.log('Received:', data.message); // "Hello server"
  
  // Send pong back
  client.send('pong', { message: 'Hello client' });
});
```

4. **Client handles server response:**
```javascript
// Client code
import.meta.hot.on('pong', (data) => {
  console.log(data.message); // "Hello client"
});
```

## Production Considerations

### Development vs Production

The `import.meta.hot` object is only available in development:

```javascript
if (import.meta.hot) {
  // This code runs only in development
  // Will be removed by tree shaking in production
  
  import.meta.hot.on('my-event', (data) => {
    console.log('Development only:', data);
  });
  
  console.log('HMR available'); // Only logs in dev
}

// This code runs in both dev and production
console.log('Always runs');
```

### Build Commands

```bash
# Development server - HMR available
npm run dev

# Production build - HMR code removed
npm run build

# Preview production build - no HMR
npm run preview
```

### Tree Shaking Behavior

```javascript
// Development build includes this
if (import.meta.hot) {
  // WebSocket communication code
  // Event listeners
  // Debug logging
}

// Production build removes the entire if block
// Only standard application code remains
```

## Complete Example

### Plugin Implementation

```javascript
// vite-websocket-plugin.js
export default function createWebSocketPlugin() {
  return {
    name: 'websocket-communication-plugin',
    
    configureServer(server) {
      // Handle new connections
      server.ws.on('connection', () => {
        console.log('🔌 Client connected via WebSocket');
        
        server.ws.send('server-ready', {
          timestamp: Date.now(),
          message: 'Server is ready for communication'
        });
      });
      
      // Handle client messages
      server.ws.on('client-ping', (data, client) => {
        console.log('📨 Received ping:', data);
        
        // Send acknowledgment
        client.send('server-pong', {
          echo: data.message,
          serverTime: Date.now(),
          response: 'Pong from server!'
        });
      });
      
      // Handle custom events
      server.ws.on('custom-data', (data, client) => {
        console.log('🎯 Custom data received:', data);
        
        // Process and respond
        client.send('data-processed', {
          original: data,
          processed: true,
          result: `Processed: ${data.value}`
        });
      });
    }
  };
}
```

### Client Implementation

```javascript
// main.js or any client file
console.log('🚀 Application starting...');

if (import.meta.hot) {
  console.log('🔥 HMR is available');
  
  // Listen for server ready
  import.meta.hot.on('server-ready', (data) => {
    console.log('✅ Server ready:', data.message);
    console.log('⏰ Server timestamp:', new Date(data.timestamp));
    
    // Send initial ping
    import.meta.hot.send('client-ping', {
      message: 'Hello from client!',
      clientTime: Date.now()
    });
  });
  
  // Handle server responses
  import.meta.hot.on('server-pong', (data) => {
    console.log('🏓 Received pong:', data.response);
    console.log('📡 Echo:', data.echo);
    console.log('🕐 Server time:', new Date(data.serverTime));
  });
  
  // Send custom data after 2 seconds
  setTimeout(() => {
    import.meta.hot.send('custom-data', {
      value: 'custom payload',
      type: 'test-data'
    });
  }, 2000);
  
  // Handle processed data
  import.meta.hot.on('data-processed', (data) => {
    console.log('⚡ Data processed:', data.result);
  });
} else {
  console.log('📦 Production build - no HMR');
}

// Regular application code
document.getElementById('app').innerHTML = `
  <h1>Vite WebSocket Communication</h1>
  <p>Check the console for WebSocket messages!</p>
`;
```

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import createWebSocketPlugin from './vite-websocket-plugin.js';

export default defineConfig({
  plugins: [
    createWebSocketPlugin()
  ],
  
  // Optional: Configure dev server
  server: {
    port: 3000,
    host: 'localhost'
  }
});
```

## Best Practices

### 1. Always Check HMR Availability
```javascript
if (import.meta.hot) {
  // WebSocket code here
  // Prevents runtime errors in production
}
```

### 2. Use Descriptive Event Names
```javascript
// Good
import.meta.hot.on('user-data-updated', handler);
import.meta.hot.send('refresh-user-list', data);

// Avoid
import.meta.hot.on('data', handler);
import.meta.hot.send('update', data);
```

### 3. Handle Errors Gracefully
```javascript
import.meta.hot.on('my-event', (data) => {
  try {
    // Process data
    processData(data);
  } catch (error) {
    console.error('Error processing WebSocket data:', error);
  }
});
```

### 4. Clean Up Resources
```javascript
// Store handler reference for cleanup
const handleMyEvent = (data) => {
  console.log(data);
};

if (import.meta.hot) {
  import.meta.hot.on('my-event', handleMyEvent);
  
  // Clean up when needed
  import.meta.hot.off('my-event', handleMyEvent);
}
```

### 5. Use TypeScript for Better Development
```typescript
interface ServerMessage {
  message: string;
  timestamp: number;
}

interface ClientPing {
  message: string;
  clientTime: number;
}

if (import.meta.hot) {
  import.meta.hot.on('server-ready', (data: ServerMessage) => {
    console.log(data.message);
  });
  
  import.meta.hot.send('client-ping', {
    message: 'Hello',
    clientTime: Date.now()
  } as ClientPing);
}
```

## Debugging Tips

### 1. Enable Verbose Logging
```javascript
if (import.meta.hot) {
  console.log('🔧 WebSocket debugging enabled');
  
  import.meta.hot.on('*', (eventName, data) => {
    console.log(`📡 Event received: ${eventName}`, data);
  });
}
```

### 2. Monitor Connection Status
```javascript
// Plugin side
configureServer(server) {
  server.ws.on('connection', () => {
    console.log('✅ Client connected');
  });
  
  server.ws.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
}
```

### 3. Test Commands
```bash
# Start development server with debug info
npm run dev -- --debug

# Build and check production bundle
npm run build && npm run preview
```

## Common Use Cases

- **Live data updates**: Push real-time data to client
- **Development tools**: Custom dev tools and debugging
- **File watching**: Custom file change notifications
- **State synchronization**: Sync state between server and client
- **Custom HMR logic**: Implement specialized hot reload behavior

This guide provides a foundation for implementing WebSocket communication in Vite plugins, enabling powerful development-time features while maintaining production build efficiency.