@echo off
chcp 65001 >nul
echo ========================================
echo   Elderly Activity Registration System
echo ========================================
echo.

echo [1/3] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js version:
node --version

echo.
echo [2/3] Installing dependencies...
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed, skipping...
)

echo.
echo [3/3] Initializing database...
if not exist "data.db" (
    call node init-data.js
    if %errorlevel% neq 0 (
        echo [WARNING] Data initialization may have issues, but server will still start.
    )
) else (
    echo Database already exists, skipping initialization...
    echo To reinitialize, delete data.db and run this script again.
)

echo.
echo ========================================
echo   Starting server...
echo   URL: http://localhost:3000
echo   Press Ctrl+C to stop
echo ========================================
echo.

node server.js

pause
