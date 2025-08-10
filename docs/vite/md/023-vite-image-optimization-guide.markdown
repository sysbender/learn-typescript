# Optimizing Images in a Vite Project

This guide demonstrates how to optimize images in a Vite project using the `vite-plugin-image-optimizer`. We’ll set up a Vite project, add an image, install and configure the plugin, and test image optimization during production builds.

## Prerequisites
- A Vite project set up with JavaScript (vanilla template).
- Node.js and npm installed.
- A code editor (e.g., VS Code) with a file size display extension (e.g., VS Code’s built-in status bar or a third-party extension).
- An image file (e.g., `image.jpg`) larger than 1 MB for testing.

## Step 1: Setting Up the Project
We’ll prepare a Vite project to display an image and verify its initial size.

1. **Create a Vite Project** (if not already set up):

```bash
npm create vite@latest image-optimization -- --template vanilla
cd image-optimization
npm install
```

2. **Add an Image**:
   - Place an image file (e.g., `image.jpg`, ~1 MB) in the `src` folder (e.g., `src/image.jpg`).
   - In VS Code, enable the status bar (View > Appearance > Show Status Bar) to see the file size in the bottom-right corner. The image size should display as ~1 MB.

3. **Update `index.html`**:
   Modify `index.html` to display the image with 100% width:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Optimization</title>
</head>
<body>
  <h1>Image Optimization Demo</h1>
  <img src="" id="image" style="width: 100%;" alt="Optimized Image">
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

4. **Update `src/main.js`**:
   Clear the file and import the image, setting it as the source for the `<img>` element:

```javascript
import image from './image.jpg';

const imgElement = document.getElementById('image');
imgElement.src = image;
```

5. **Test the Development Server**:
   Start the Vite development server:

```bash
npm run dev
```

   Open the browser (usually at `http://localhost:5173`) to confirm the image displays correctly.

## Step 2: Installing the Image Optimization Plugin
We’ll use the `vite-plugin-image-optimizer` plugin, which relies on `sharp` and `svgo` for image optimization.

1. **Install the Plugin**:

```bash
npm install vite-plugin-image-optimizer --save-dev
```

2. **Install Dependencies**:
   Install `sharp` and `svgo`, required by the plugin:

```bash
npm install sharp --save-dev
npm install svgo --save-dev
```

## Step 3: Configuring the Plugin
Create and configure a `vite.config.js` file to use the image optimization plugin.

1. **Create `vite.config.js`**:

```javascript
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      jpg: {
        quality: 80
      }
    })
  ]
});
```

### Explanation
- `ViteImageOptimizer`: The plugin for optimizing images.
- `jpg: { quality: 80 }`: Configures JPEG optimization with a quality setting of 80 (out of 100). Lower values reduce file size but may impact quality.
- Optimization occurs only during production builds (`npm run build`), not in development.

## Step 4: Building and Testing Optimization
Build the project to optimize the image and verify the results.

1. **Run the Production Build**:

```bash
npm run build
```

2. **Check Build Output**:
   - The terminal output shows optimization results, e.g.:
     ```
     ✓ built in 1.23s
     Optimized: dist/assets/image-[hash].jpg (from 1.02 MB to ~744 KB)
     Optimized: dist/vite.svg (from 1.2 KB to ~1 KB)
     ```
   - The `image.jpg` size is reduced by ~300 KB (from ~1 MB to ~744 KB).
   - The default `vite.svg` in the `public` folder is also optimized (minimal change due to its small size).

3. **Preview the Production Build**:

```bash
npm run preview
```

4. Open the browser (usually at `http://localhost:4173`) and confirm:
   - The optimized image displays correctly.
   - In the browser’s developer tools (Network tab), the image size is ~744 KB.

## Step 5: Adjusting Optimization Settings
Test a lower quality setting to further reduce the image size.

1. **Update `vite.config.js`**:
   Change the JPEG quality to 40:

```javascript
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      jpg: {
        quality: 40
      }
    })
  ]
});
```

2. **Rebuild the Project**:

```bash
npm run build
```

3. **Check Build Output**:
   - The terminal shows a further reduced size, e.g.:
     ```
     Optimized: dist/assets/image-[hash].jpg (from 1.02 MB to ~392 KB)
     ```
   - The image size is now ~392 KB, a significant reduction from the original ~1 MB.

4. **Preview the Build**:

```bash
npm run preview
```

5. Open the browser and verify:
   - The image displays with slightly reduced quality but is still acceptable.
   - The Network tab confirms the image size is ~392 KB.

## Step 6: Comparing Original and Optimized Images
- **Original Image**: `src/image.jpg` (~1.02 MB).
- **Optimized Image (Quality 80)**: `dist/assets/image-[hash].jpg` (~744 KB).
- **Optimized Image (Quality 40)**: `dist/assets/image-[hash].jpg` (~392 KB).
- The plugin significantly reduces file size while maintaining acceptable visual quality.

## Step 7: Understanding the Plugin
- **How It Works**:
  - The `vite-plugin-image-optimizer` uses `sharp` for raster images (e.g., JPEG, PNG) and `svgo` for SVG files.
  - Optimization occurs only during `npm run build`, not in development (`npm run dev`).
- **Configuration Options**:
  - The plugin supports various formats (e.g., `png`, `jpeg`, `webp`, `svg`) with customizable settings like `quality`, `compressionLevel`, etc.
  - Example for other formats:
    ```javascript
    ViteImageOptimizer({
      jpg: { quality: 80 },
      png: { compressionLevel: 6 },
      svg: { multipass: true }
    })
    ```
- **Other Plugins**:
  - Alternatives include `vite-plugin-imagemin` or `vite-plugin-images`.
  - Choose a plugin based on your project’s needs (e.g., supported formats, ease of configuration).

## Additional Notes
- **Installation Process**:
  - Install the plugin and its dependencies (`sharp`, `svgo`).
  - Add the plugin to `vite.config.js` with desired settings.
- **TypeScript Support**:
  - The plugin works seamlessly with TypeScript projects; no additional configuration is needed.
- **Best Practices**:
  - Test different `quality` settings to balance file size and visual quality.
  - Use the browser’s Network tab to verify optimized image sizes.
  - Include only necessary image formats in the configuration to optimize build time.
- **Limitations**:
  - Optimization is production-only, so development builds use original image sizes.
  - Large images may still require additional techniques (e.g., lazy loading, WebP conversion).
- **VS Code Extension**:
  - Use a file size display extension (e.g., VS Code’s status bar or “File Size” by Alex Shen) to monitor image sizes in the editor.

This setup demonstrates how to integrate and configure an image optimization plugin in Vite, significantly reducing image file sizes for production builds while maintaining functionality.