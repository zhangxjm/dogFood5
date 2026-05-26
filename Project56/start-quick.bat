@echo off
chcp 65001 >nul
echo ========================================
echo Craft Course System - Quick Start
echo ========================================
echo.

echo [1/3] Starting backend...
cd backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting backend server...
start "Backend API" cmd /k "npm run start:dev"
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo [2/3] Seeding initial data...
cd backend
set DB_HOST=localhost
set DB_PORT=3306
set DB_USER=root
set DB_PASSWORD=root
set DB_NAME=craft_course
call npm run seed 2>nul
cd ..

echo [3/3] Starting frontend...
cd frontend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting frontend dev server...
start "Frontend H5" cmd /k "npm run dev:h5"
cd ..

echo.
echo ========================================
echo System starting...
echo Backend API: http://localhost:3000
echo API Docs: http://localhost:3000/api-docs
echo Frontend H5: http://localhost:10086
echo ========================================
echo.
echo Note: Make sure MySQL is running on localhost:3306
echo If MySQL is not installed, run:
echo   docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=craft_course mysql:8.0
echo.
pause
