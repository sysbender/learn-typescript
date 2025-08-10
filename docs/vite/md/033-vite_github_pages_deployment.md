# Vite Application Deployment to GitHub Pages

## Course Overview
This guide covers the complete process of deploying a Vite application to GitHub Pages, from initial setup to final deployment. Learn how to configure your project, set up GitHub Actions, and automate your deployment workflow.

## Prerequisites
- Basic knowledge of Git and GitHub
- Node.js and npm installed
- Existing Vite project
- GitHub repository for your project

## Table of Contents
1. [Introduction to Deployment Services](#introduction-to-deployment-services)
2. [Prerequisites Setup](#prerequisites-setup)
3. [Vite Configuration](#vite-configuration)
4. [GitHub Repository Setup](#github-repository-setup)
5. [GitHub Pages Configuration](#github-pages-configuration)
6. [GitHub Actions Workflow](#github-actions-workflow)
7. [Deployment Process](#deployment-process)
8. [Verification and Testing](#verification-and-testing)
9. [Troubleshooting](#troubleshooting)
10. [Alternative Hosting Providers](#alternative-hosting-providers)

---

## 1. Introduction to Deployment Services

### What is GitHub Pages?
GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files straight from a repository on GitHub and publishes them as a website.

### Why Use GitHub Pages?
- **Free hosting** for static websites
- **Automatic deployment** from GitHub repositories
- **Custom domain support**
- **HTTPS by default**
- **Integration with GitHub Actions**

### Other Popular Deployment Services
- Netlify
- Vercel
- Surge.sh
- Firebase Hosting
- AWS S3 + CloudFront

---

## 2. Prerequisites Setup

### Required Tools
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

### Project Structure
```
my-vite-app/
├── src/
├── public/
├── dist/           # Build output directory
├── package.json
├── vite.config.js  # Configuration file (to be created)
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions workflow
```

---

## 3. Vite Configuration

### Create vite.config.js
Create a configuration file in your project root:

```javascript
// vite.config.js
export default {
  base: '/repository-name/', // Replace with your actual repository name
}
```

### Important Configuration Options

#### Base Path Configuration
```javascript
export default {
  base: '/vite-deployment/', // Must match your GitHub repository name
  build: {
    outDir: 'dist', // Default output directory
  }
}
```

#### Alternative Configuration (for custom domains)
```javascript
export default {
  base: '/', // Use root path for custom domains
}
```

### Key Points
- The `base` option **must match** your GitHub repository name exactly
- Use format: `/repository-name/`
- This ensures proper asset loading on GitHub Pages

---

## 4. GitHub Repository Setup

### Repository URL Format
```
https://github.com/username/repository-name
```

### Required Steps
1. **Create repository** on GitHub
2. **Push your code** to the main branch
3. **Verify repository** contains your Vite project

### Git Commands
```bash
# Initialize git (if not already done)
git init

# Add remote origin
git remote add origin https://github.com/username/repository-name.git

# Add and commit configuration file
git add vite.config.js
git commit -m "Add Vite configuration for GitHub Pages deployment"

# Push to main branch
git push origin main
```

---

## 5. GitHub Pages Configuration

### Access GitHub Pages Settings
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in left sidebar

### Configure Source
- **Source**: Select "GitHub Actions"
- **Branch**: Main branch will be used for deployment

### GitHub Pages URL
Your deployed application will be available at:
```
https://username.github.io/repository-name/
```

---

## 6. GitHub Actions Workflow

### Create Workflow File
Create `.github/workflows/deploy.yml` in your repository:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build project
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Workflow Breakdown

#### Triggers
- **Push to main branch**: Automatic deployment
- **Manual trigger**: `workflow_dispatch` allows manual runs

#### Permissions
```yaml
permissions:
  contents: read    # Read repository contents
  pages: write      # Write to GitHub Pages
  id-token: write   # Required for deployment
```

#### Build Steps
1. **Checkout code** from repository
2. **Setup Node.js** (version 18)
3. **Install dependencies** (`npm install`)
4. **Build project** (`npm run build`)
5. **Upload build artifacts** from `dist` folder
6. **Deploy to GitHub Pages**

---

## 7. Deployment Process

### Automatic Deployment
Every push to the main branch triggers deployment:

```bash
# Make changes to your code
git add .
git commit -m "Update application"
git push origin main
```

### Manual Deployment
1. Go to **Actions** tab in your GitHub repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

### Monitoring Deployment
- Check **Actions** tab for deployment status
- View detailed logs for each step
- Monitor build progress in real-time

---

## 8. Verification and Testing

### Check Deployment Status
1. Visit **Actions** tab
2. Look for green checkmark (✅) indicating success
3. Red X (❌) indicates failure - check logs

### Access Your Application
Navigate to your GitHub Pages URL:
```
https://username.github.io/repository-name/
```

### Common Verification Steps
- Check if all assets load correctly
- Test navigation and routing
- Verify responsive design
- Test functionality

---

## 9. Troubleshooting

### Common Issues and Solutions

#### 404 Error on Deployment
```javascript
// Fix: Check base configuration
export default {
  base: '/exact-repository-name/', // Must match GitHub repo name
}
```

#### Assets Not Loading
- Verify `base` path is correct
- Check build output in `dist` folder
- Ensure all imports use relative paths

#### Build Failures
```bash
# Check local build
npm run build

# Verify Node.js version matches workflow
node --version
```

#### Deployment Not Triggering
- Ensure workflow file is in `.github/workflows/`
- Check branch name matches trigger configuration
- Verify workflow syntax using GitHub's validator

### Debug Commands
```bash
# Local build test
npm run build
npx serve dist

# Check configuration
cat vite.config.js

# Verify git status
git status
git log --oneline
```

---

## 10. Alternative Hosting Providers

### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Configuration Differences
| Provider | Base Path | Build Command | Output Directory |
|----------|-----------|---------------|------------------|
| GitHub Pages | `/repo-name/` | `npm run build` | `dist` |
| Netlify | `/` | `npm run build` | `dist` |
| Vercel | `/` | `npm run build` | `dist` |

---

## Summary

### Key Takeaways
1. **GitHub Pages** provides free static site hosting
2. **Vite configuration** requires proper base path setup
3. **GitHub Actions** automates the deployment process
4. **Deployment is triggered** automatically on push to main branch
5. **Process is similar** across different hosting providers

### Essential Commands
```bash
# Create Vite config
touch vite.config.js

# Create GitHub Actions workflow
mkdir -p .github/workflows
touch .github/workflows/deploy.yml

# Deploy changes
git add .
git commit -m "Deploy updates"
git push origin main
```

### Next Steps
- Explore custom domain configuration
- Set up different environments (staging/production)
- Implement advanced deployment strategies
- Learn about other static site generators

---

## Additional Resources
- [Vite Documentation](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Static Site Deployment Best Practices](https://docs.github.com/en/pages/getting-started-with-github-pages)

---

*Course completed! You now have the knowledge to deploy Vite applications to GitHub Pages and understand the fundamentals that apply to other hosting providers as well.*