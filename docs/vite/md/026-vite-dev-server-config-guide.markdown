# Configuring Vite Development and Preview Servers

This guide explores how to configure the Vite development and preview servers using the `server` and `preview` options in the Vite configuration file. We’ll customize the port, handle port conflicts, set custom headers, configure proxy rules for API requests, and automatically open specific URLs in the browser. The setup uses a third-party API (`dummyjson.com`) to demonstrate proxy functionality.

## Prerequisites
- A Vite project set up with JavaScript (vanilla template).
- Node.js and npm installed.
- A code editor (e.g., VS Code) and a terminal.
- Access to a browser with developer tools to inspect network requests.

## Step 1: Setting Up the Project
Create a basic Vite project to test server configurations.

1. **Create a Vite Project** (if not already set up):

```bash
npm create vite@latest server-config-demo -- --template vanilla
cd server-config-demo
npm install
```

2. **Run the Development Server**:
   Start the server to confirm the default behavior:

```bash
npm run dev
```

   - The server runs on `http://localhost:5173`.
   - If another instance is started, Vite automatically selects a different port (e.g., `5174`) to avoid conflicts.

## Step 2: Configuring the Development Server Port
Customize the port and control port conflict behavior.

1. **Create `vite.config.js`**:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3333
  }
});
```

2. **Test the Custom Port**:
   Run the development server:

```bash
npm run dev
```

   - The server starts on `http://localhost:3333`.
   - Launch another terminal and run `npm run dev` again:
     - Vite picks a different port (e.g., `3334`) because `3333` is in use.

3. **Enforce Strict Port**:
   Prevent Vite from selecting a different port if the specified one is taken:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3333,
    strictPort: true
  }
});
```

4. **Test Strict Port**:
   - Start the first instance:

```bash
npm run dev
```

   - Start a second instance in another terminal:

```bash
npm run dev
```

   - Vite throws an error:
     ```
     Error: Port 3333 is already in use
     ```
     - The second instance fails to start, respecting `strictPort: true`.

## Step 3: Adding Custom Headers
Add custom HTTP response headers for development server requests.

1. **Update `vite.config.js`**:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3333,
    strictPort: true,
    headers: {
      'X-Custom-Header': 'B'
    }
  }
});
```

2. **Test Custom Headers**:
   - Run `npm run dev` and open `http://localhost:3333` in the browser.
   - Open the browser’s developer tools (Network tab), refresh the page, and select the request for `/` (the main HTML page).
   - Check the **Response Headers**: You should see `X-Custom-Header: B`.
   - Fetch a JavaScript file (e.g., `src/main.js`): The custom header is also applied.

## Step 4: Configuring Proxy for API Requests
Set up a proxy to forward API requests to a third-party service (`dummyjson.com`).

1. **Add Proxy Configuration**:
   Update `vite.config.js` to proxy `/products` to `https://dummyjson.com/products`:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3333,
    strictPort: true,
    headers: {
      'X-Custom-Header': 'B'
    },
    proxy: {
      '/products': 'https://dummyjson.com'
    }
  }
});
```

2. **Test the Proxy**:
   - Run `npm run dev`.
   - In the browser, navigate to `http://localhost:3333/products`.
   - Expected response: A JSON object containing a list of products from `https://dummyjson.com/products`.

3. **Advanced Proxy Configuration**:
   Use an object to customize the proxy, removing the `/api` segment from the URL:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3333,
    strictPort: true,
    headers: {
      'X-Custom-Header': 'B'
    },
    proxy: {
      '/products': 'https://dummyjson.com',
      '/api': {
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

4. **Test Advanced Proxy**:
   - Navigate to `http://localhost:3333/api/products`.
   - Expected behavior: The `/api` segment is removed, and the request is forwarded to `https://dummyjson.com/products`.
   - Initial test may result in a 500 error due to CORS (Cross-Origin Resource Sharing) issues.
   - The `changeOrigin: true` option sets the `Host` header to match the target (`dummyjson.com`), helping mitigate CORS issues.

5. **Test Alternative Endpoint**:
   Update the proxy to fetch posts:

```javascript
proxy: {
  '/products': 'https://dummyjson.com',
  '/api': {
    target: 'https://dummyjson.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  },
  '/posts': 'https://dummyjson.com'
}
```

   - Navigate to `http://localhost:3333/posts`.
   - Expected response: A JSON object containing a list of posts from `https://dummyjson.com/posts`.

## Step 5: Configuring the Preview Server
Configure the preview server (used for production builds) separately.

1. **Build and Preview**:
   - Build the project:

```bash
npm run build
```

   - Start the preview server:

```bash
npm run preview
```

   - The default port is `4173` (e.g., `http://localhost:4173`).

2. **Add Preview Configuration**:
   Update `vite.config.js` to customize the preview server:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3333,
    strictPort: true,
    headers: {
      'X-Custom-Header': 'B'
    },
    proxy: {
      '/products': 'https://dummyjson.com',
      '/api': {
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    open: '/api/products'
  }
});
```

### Explanation
- **preview.port**: Sets the preview server port to `4000`.
- **preview.proxy**: Applies proxy rules for the preview server, similar to the development server.
- **preview.open**: Automatically opens `http://localhost:4000/api/products` in the browser after starting the preview server.

3. **Test the Preview Server**:
   - Run `npm run build` and `npm run preview`.
   - The browser opens `http://localhost:4000/api/products`, displaying the product list from `dummyjson.com`.
   - The `/api` segment is removed, and the request is forwarded to `https://dummyjson.com/products`.

## Step 6: Understanding the Configuration
- **Port Customization**:
  - `server.port` and `preview.port` set specific ports for development and preview servers.
  - `server.strictPort: true` enforces the specified port, throwing an error if it’s in use.
- **Custom Headers**:
  - `server.headers` adds headers to all responses (e.g., HTML, JavaScript, assets).
- **Proxy**:
  - `server.proxy` and `preview.proxy` forward requests to external services, useful for mocking APIs during development.
  - Object-based proxy rules allow advanced configuration like URL rewriting (`rewrite`) and CORS handling (`changeOrigin`).
- **Open Browser**:
  - `preview.open` automatically opens a specified URL, enhancing the development workflow.
- **Documentation**:
  - See the [Vite documentation](https://vite.dev/config/server-options.html) for all server and preview options (e.g., `host`, `https`, `cors`).

## Additional Notes
- **TypeScript Support**:
  - The configuration works identically in TypeScript projects; use `vite.config.ts` instead.
- **CORS Handling**:
  - `changeOrigin: true` helps with CORS by setting the correct `Host` header, but some APIs may require additional configuration or server-side CORS headers.
- **Proxy Use Cases**:
  - Use proxies to mock APIs, integrate with third-party services, or bypass CORS during development.
- **Best Practices**:
  - Test proxy rules with multiple endpoints to ensure correct forwarding.
  - Use `strictPort` in CI/CD environments to avoid unexpected port changes.
  - Document custom headers and proxy rules in your project’s README.
- **Troubleshooting**:
  - Check the browser’s Network tab to verify headers and proxy responses.
  - If CORS errors persist, consider additional proxy options like `configure` to customize headers.

This setup demonstrates how to configure Vite’s development and preview servers, including custom ports, headers, proxy rules, and automatic browser opening, streamlining local development with external APIs.