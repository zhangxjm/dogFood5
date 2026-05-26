@echo off
echo ========================================
echo Craft Course System - Local Start
echo ========================================

echo [1/4] Installing backend dependencies...
cd backend
call npm install

echo [2/4] Building backend...
call npm run build

echo [3/4] Seeding initial data...
set DB_HOST=localhost
set DB_PORT=3306
set DB_USER=root
set DB_PASSWORD=root
set DB_NAME=craft_course
call npm run seed

echo [4/4] Starting backend server...
start "Backend Server" cmd /k "npm run start:dev"

cd ..

echo ========================================
echo Backend starting...
echo API: http://localhost:3000
echo API Docs: http://localhost:3000/api-docs
echo ========================================
echo Starting frontend dev server...
cd frontend
call npm install
start "Frontend Server" cmd /k "npm run dev:h5"

echo ========================================
echo All services started!
echo Backend: http://localhost:3000
echo Frontend H5: http://localhost:10086
echo ========================================
pause
