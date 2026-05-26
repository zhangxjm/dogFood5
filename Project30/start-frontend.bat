@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0\frontend"

where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js 18+.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo [INFO] Starting Frontend Dev Server on http://127.0.0.1:5173
echo [INFO] API proxy: /api -^> http://127.0.0.1:8000
echo [INFO] Press Ctrl+C to stop.
call npm run dev

endlocal
