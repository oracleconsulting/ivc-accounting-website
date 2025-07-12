# Deployment Fix Guide - IVC Accounting Campaign System

## 🚨 Current Issue

The build is failing because the `package-lock.json` file is out of sync with the `package.json` file. The new dependencies we added for the campaign system aren't in the lock file.

## 🔧 Quick Fix

### Option 1: Local Fix (Recommended)

1. **Run the regeneration script**:
   ```bash
   npm run regenerate-lock
   ```

2. **Commit the changes**:
   ```bash
   git add package-lock.json
   git commit -m "Regenerate package-lock.json for campaign system dependencies"
   git push
   ```

3. **Deploy to Railway**:
   ```bash
   railway up
   ```

### Option 2: Manual Fix

1. **Clean up existing files**:
   ```bash
   rm -rf node_modules
   rm -f package-lock.json
   ```

2. **Reinstall dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Commit and deploy**:
   ```bash
   git add package-lock.json
   git commit -m "Fix package-lock.json sync issues"
   git push
   railway up
   ```

## 🐳 Dockerfile Changes Made

The Dockerfile has been updated to handle this issue:

```dockerfile
# Before (causing issues)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# After (fixed)
COPY package.json ./
RUN npm cache clean --force && npm install --legacy-peer-deps
```

## 📦 New Dependencies Added

The following dependencies were added for the campaign system:

```json
{
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1", 
  "recharts": "^2.12.0",
  "react-markdown": "^9.0.0",
  "remark-gfm": "^4.0.0",
  "sonner": "^1.4.0",
  "tsx": "^4.7.0"
}
```

## 🔍 Why This Happened

1. **Package-lock.json out of sync**: The lock file was created before the new dependencies were added
2. **npm ci vs npm install**: `npm ci` requires exact lock file sync, while `npm install` can resolve differences
3. **Node.js version**: Updated to Node.js 20 for compatibility with new dependencies

## ✅ Verification Steps

After fixing, verify the deployment:

1. **Check build logs** - Should show successful dependency installation
2. **Test campaign system** - Run `npm run campaign:test`
3. **Verify admin pages** - Check `/admin/social/campaigns`
4. **Test API endpoints** - Verify `/api/campaign/create` works

## 🚀 Next Steps After Fix

1. **Database migration**: Run the campaign schema in Supabase
2. **Environment variables**: Set up OpenRouter API key
3. **Test the system**: Create a test campaign
4. **Train the team**: Show how to use the new features

## 📞 If Issues Persist

If the build still fails after the fix:

1. **Check Railway logs** for specific error messages
2. **Verify Node.js version** is 20+ in Railway
3. **Clear Railway cache** if needed
4. **Contact support** with specific error details

## 🎯 Expected Outcome

After applying the fix:

- ✅ Build should complete successfully
- ✅ All new dependencies will be installed
- ✅ Campaign system will be fully functional
- ✅ No breaking changes to existing functionality

---

**The campaign system is ready to deploy once the package-lock.json is regenerated! 🚀** 