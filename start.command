#!/bin/bash

# MonkeyMath Auto-Start Script
# Double-click this file to run MonkeyMath!

# Change to the script's directory
cd "$(dirname "$0")"

echo "🐵 Starting MonkeyMath..."
echo ""

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time only)..."
    npm install
    echo ""
fi

# Start the development server
echo "🚀 Starting development server..."
echo "📱 MonkeyMath will open in your browser automatically!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start dev server and open browser
npm run dev &
sleep 3
open http://localhost:5173

# Wait for the dev server process
wait

