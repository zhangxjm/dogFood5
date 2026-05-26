@echo off
chcp 65001 >nul
echo ========================================
echo   Craft Course Registration System
echo   Starting All Services...
echo ========================================
echo.

echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker not found. Please install Docker Desktop first.
    pause
    exit /b 1
)
echo [OK] Docker is available.

echo.
echo [2/5] Starting MySQL and Redis containers...
cd /d "%~dp0"
docker compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start containers.
    pause
    exit /b 1
)
echo [OK] Containers started.

echo.
echo [3/5] Waiting for MySQL to be ready...
timeout /t 15 /nobreak >nul

echo.
echo [4/5] Installing backend dependencies and starting...
cd /d "%~dp0backend"
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
)

echo.
echo Running database seed...
call npx ts-node src/seed.ts

echo.
echo Starting backend server...
start "Craft Course Backend" cmd /k "cd /d %~dp0backend && npx nest start --watch"

echo.
echo [5/5] Installing frontend dependencies and starting...
cd /d "%~dp0web-frontend"
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
)

echo.
echo Starting frontend server...
start "Craft Course Frontend" cmd /k "cd /d %~dp0web-frontend && npm run dev"

echo.
echo ========================================
echo   System Started Successfully!
echo ========================================
echo.
echo   Backend API:  http://localhost:3000
echo   Frontend Web: http://localhost:5173
echo.
echo   API Endpoints:
echo     GET  /courses          - List all courses
echo     POST /courses          - Create course
echo     GET  /registrations    - List registrations
echo     POST /registrations    - Create registration
echo     GET  /schedules        - List schedules
echo     POST /schedules        - Create schedule
echo     GET  /attendances      - List attendances
echo     POST /attendances/batch - Batch attendance
echo.
echo   Press any key to open frontend...
echo ========================================
echo.
pause
start http://localhost:5173
