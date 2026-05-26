@echo off
chcp 65001 >nul
echo ============================================
echo   Plant Care Service System - Startup Script
echo ============================================
echo.

echo [1/4] Checking Node.js environment...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo Node.js version:
node --version

echo.
echo [2/4] Installing backend dependencies...
cd server
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo Error: Backend dependency installation failed
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)
cd ..

echo.
echo [3/4] Installing frontend dependencies...
cd client
if not exist "node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo Error: Frontend dependency installation failed
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)
cd ..

echo.
echo [4/4] Starting services...
echo.

echo Starting backend server on port 3001...
start "Plant Care Backend" cmd /c "cd server && npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend dev server on port 5173...
start "Plant Care Frontend" cmd /c "cd client && npm run dev"

echo.
echo ============================================
echo   System is starting up...
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:3001/api
echo ============================================
echo.
echo Press any key to exit this window (services will continue running)
pause >nul
