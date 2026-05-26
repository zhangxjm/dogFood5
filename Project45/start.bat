@echo off
echo ========================================
echo   Travel Planner System
echo ========================================
echo.

echo [INFO] Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo [INFO] Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version

echo.
echo [INFO] Checking npm installation...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH
    pause
    exit /b 1
)

echo [INFO] npm version:
npm --version

echo.
echo [INFO] Installing dependencies...
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [INFO] node_modules already exists, skipping install
)

echo.
echo [INFO] Starting Travel Planner Server...
echo [INFO] Server will be available at http://localhost:3000
echo [INFO] Press Ctrl+C to stop the server
echo.

node src/server.js

pause
