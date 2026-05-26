@echo off
echo ========================================
echo Craft Course System - Quick Start
echo ========================================
echo.

echo [1/5] Cleaning old backend node_modules...
cd backend
if exist node_modules (
    rmdir /s /q node_modules
)
if exist package-lock.json (
    del /q package-lock.json
)

echo [2/5] Installing backend dependencies...
call npm install --legacy-peer-deps --no-audit --loglevel error
if errorlevel 1 (
    echo WARNING: Backend npm install had errors, trying to continue...
)

echo [3/5] Seeding initial data...
if exist craft_course.db (
    del /q craft_course.db
)
call npm run seed

echo [4/5] Starting backend server...
start "Backend API" cmd /k "npm start"
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo [5/5] Starting frontend...
cd frontend
if exist node_modules (
    echo Cleaning old frontend node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    del /q package-lock.json
)
echo Installing frontend dependencies...
call npm install --legacy-peer-deps --no-audit --loglevel error
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
pause
