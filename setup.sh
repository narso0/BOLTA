#!/bin/bash

echo "🚀 Setting up Bolta Fitness App..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "Current Node.js version: $NODE_VERSION"

# Extract major version number
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required."
    echo "Please upgrade Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version is compatible"

# Clean install
echo "🧹 Cleaning previous installations..."
rm -rf node_modules package-lock.json

echo "📦 Installing dependencies..."
npm install

echo "🔧 Checking for any remaining issues..."
npm audit --audit-level moderate

echo "🎉 Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The app will be available at: http://localhost:5173"