@echo off
echo ========================================
echo Craft Course System - Full Install
echo ========================================
echo.

echo [1/6] Installing backend dependencies...
cd backend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo Backend npm install failed
    pause
    exit /b 1
)

echo [2/6] Seeding initial data...
call npm run seed
if errorlevel 1 (
    echo Seed failed, but continuing...
)

echo [3/6] Starting backend server...
start "Backend API" cmd /k "npm run start:dev"
cd ..

echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo [4/6] Installing frontend dependencies...
cd frontend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo Frontend npm install failed
    pause
    exit /b 1
)

echo [5/6] Building frontend...
call npm run build:h5

echo [6/6] Starting frontend dev server...
start "Frontend H5" cmd /k "npm run dev:h5"
cd ..

echo.
echo ========================================
echo System starting!
echo Backend API: http://localhost:3000
echo API Docs: http://localhost:3000/api-docs
echo Frontend H5: http://localhost:10086
echo ========================================
echo.
echo Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:10086
echo.
pause
