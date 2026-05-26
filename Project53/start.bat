@echo off
chcp 65001 >nul
echo ==========================================
echo   Starting Liquor Retail Management System
echo ==========================================

echo.
echo [1/5] Starting MongoDB container...
docker-compose up -d mongodb
if %errorlevel% neq 0 (
    echo Failed to start MongoDB. Please make sure Docker is running.
    pause
    exit /b 1
)

echo.
echo [2/5] Waiting for MongoDB to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [3/5] Setting up backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo Backend npm install failed
        pause
        exit /b 1
    )
)

echo.
echo [4/5] Initializing database...
call node scripts/initData.js
if %errorlevel% neq 0 (
    echo Database initialization failed
    pause
    exit /b 1
)

echo.
echo [5/5] Starting backend server...
start "Liquor Backend" cmd /k npm start
if %errorlevel% neq 0 (
    echo Failed to start backend
    pause
    exit /b 1
)

cd ..\frontend

echo.
echo Setting up frontend...
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo Frontend npm install failed
        pause
        exit /b 1
    )
)

echo.
echo Starting frontend dev server...
start "Liquor Frontend" cmd /k npm run dev
if %errorlevel% neq 0 (
    echo Failed to start frontend
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   System Started Successfully!
echo ==========================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo ==========================================
echo.
echo To stop: close the backend and frontend windows
echo.

pause
