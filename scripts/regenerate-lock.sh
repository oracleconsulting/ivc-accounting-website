#!/bin/bash

# Script to regenerate package-lock.json and fix dependency issues

echo "🧹 Cleaning up existing files..."
rm -rf node_modules
rm -f package-lock.json

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo "✅ Package-lock.json regenerated successfully!"
echo "📋 Next steps:"
echo "1. Commit the new package-lock.json file"
echo "2. Deploy to Railway"
echo "3. The build should now succeed" 