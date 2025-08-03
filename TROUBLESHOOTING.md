# Troubleshooting Guide

## Common Setup Issues

### 1. "vite: not found" Error

**Problem:** When running `npm run dev`, you get `sh: 1: vite: not found`

**Solution:**
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 2. Firebase Engine Warnings

**Problem:** Multiple warnings about unsupported Node.js version for Firebase packages

**Solution:** These warnings are safe to ignore if you're using Node.js 18+. The app uses Firebase v10 which is compatible with Node.js 18.

### 3. Import/Export Errors

**Problem:** Errors like `No matching export in "src/hooks/use-mobile.tsx" for import "useMobile"`

**Solution:** This has been fixed in the latest version. Make sure you have the latest code:
```bash
git pull origin main
npm install
```

### 4. Node.js Version Issues

**Problem:** Your Node.js version is too old

**Solution:** 
- Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Or use nvm: `nvm install 18 && nvm use 18`

### 5. Port Already in Use

**Problem:** Port 5173 is already in use

**Solution:**
```bash
# Kill any process using port 5173
npx kill-port 5173
npm run dev
```

### 6. Firebase Connection Issues

**Problem:** App shows "Connection Error" screen

**Solution:**
- Check your internet connection
- Verify Firebase configuration in `src/lib/firebase.ts`
- Check browser console for detailed error messages

## Quick Setup Script

Use the provided setup script for automated setup:

```bash
./setup.sh
```

This script will:
- Check Node.js version compatibility
- Clean previous installations
- Install dependencies
- Run basic health checks

## Getting Help

If you're still experiencing issues:

1. Check the browser console for error messages
2. Verify all dependencies are installed: `npm list`
3. Try a clean installation: `rm -rf node_modules package-lock.json && npm install`
4. Check the [GitHub Issues](https://github.com/narso0/BOLTA/issues) for similar problems