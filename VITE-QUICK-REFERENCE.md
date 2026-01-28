# Vite Migration Quick Reference

## Key Changes at a Glance

### Environment Variables
```typescript
// OLD (CRA/Webpack)
process.env.REACT_APP_ENV
process.env.REACT_APP_API_URL

// NEW (Vite)
import.meta.env.VITE_APP_ENV
import.meta.env.VITE_API_URL
```

### HTML File Location
```
OLD: public/index.html (with %PUBLIC_URL%)
NEW: index.html (root, with / paths)
```

### Scripts
```bash
# Development
npm start          # Same - starts dev server

# Building
npm run build      # Same - production build
npm run preview    # NEW - preview production build

# Testing  
npm test           # Same - run tests
npm run test:watch # Same - watch mode
npm run test:ui    # NEW - interactive test UI
```

### File Structure Changes
```
NEW FILES:
✅ vite.config.ts
✅ tsconfig.node.json
✅ index.html (root)
✅ src/vite-env.d.ts
✅ .env.production-github
✅ .env.production-firebase

TO DELETE:
❌ public/index.html
❌ src/react-app-env.d.ts

UPDATED:
📝 package.json
📝 tsconfig.json
📝 src/index.tsx
📝 src/setupTests.ts
📝 .env
```

### Import Differences
```typescript
// SVG as Component (if needed)
import Logo from './logo.svg?react'  // Vite syntax

// Assets (same)
import image from './image.png'

// CSS (same)
import './styles.css'

// JSON (same)
import data from './data.json'
```

### Build Output
```
Same directory: build/
Same deployment: npm run deploy
```

### Port Configuration
```typescript
// vite.config.ts
server: {
  port: 3000,  // Same as CRA default
}
```

### Browser Support
```
Target: ES2020+ (more modern than CRA's ES5)
If older browser support needed, adjust vite.config.ts
```

## Common Issues & Solutions

### Issue: Module not found
**Solution:** Check import paths, Vite is stricter about file extensions in dev

### Issue: process.env is undefined
**Solution:** Replace with import.meta.env and use VITE_ prefix

### Issue: Tests failing
**Solution:** Check setupTests.ts has Vitest imports and matchers

### Issue: Build size too large
**Solution:** Check vite.config.ts manualChunks configuration

### Issue: Base path wrong in production
**Solution:** Check .env files and vite.config.ts base setting

## Performance Comparison

| Metric | CRA (Webpack) | Vite | Improvement |
|--------|---------------|------|-------------|
| Dev Start | 10-30s | 1-3s | ~10x faster |
| HMR | 1-5s | <100ms | ~50x faster |
| Build | 60-120s | 20-40s | ~3x faster |
| Bundle | Baseline | -10-20% | Smaller |

## Environment Modes

```bash
# Development (default)
npm start                          # Uses .env

# Production builds
npm run build                      # Uses .env.production (if exists)
npm run build:gh-pages            # Uses .env.production-github
npm run build:site                # Uses .env.production-firebase

# Test
npm test                          # Uses .env.test
```

## Useful Vite Features

### Import Glob
```typescript
const modules = import.meta.glob('./dir/*.js')
```

### Import as String
```typescript
import shaderSource from './shader.glsl?raw'
```

### Import as URL
```typescript
import workerUrl from './worker.js?url'
```

### Environment Variables
```typescript
// Only VITE_ prefixed vars are exposed to client
import.meta.env.VITE_API_KEY  // ✅ Available
import.meta.env.DATABASE_URL  // ❌ Not available (security)

// Built-in variables
import.meta.env.MODE           // 'development' or 'production'
import.meta.env.DEV            // boolean
import.meta.env.PROD           // boolean
import.meta.env.SSR            // boolean
```

## Need Help?

1. Check `VITE-MIGRATION-SUMMARY.md`
2. Check `MIGRATION-GUIDE.md`
3. Run `search-env-vars.bat` to find env var issues
4. Visit https://vitejs.dev/guide/
5. Visit https://vitest.dev/guide/

## Emergency Rollback

```bash
git checkout package.json tsconfig.json src/index.tsx src/setupTests.ts
git clean -fd
npm install
```
