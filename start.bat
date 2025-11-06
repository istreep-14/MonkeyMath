@echo off
REM MonkeyMath Auto-Start Script for Windows
REM Double-click this file to run MonkeyMath!

echo.
echo 🐵 Starting MonkeyMath...
echo.

REM Change to the script's directory
cd /d %~dp0

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules\" (
    echo 📦 Installing dependencies (first time only)...
    call npm install
    echo.
)

REM Start the development server
echo 🚀 Starting development server...
echo 📱 MonkeyMath will open in your browser automatically!
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start dev server
start http://localhost:5173
npm run dev

pause

