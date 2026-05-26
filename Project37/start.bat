@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================
echo   Fitness Plan Management System - Start
echo ============================================
echo.

echo [1/6] Starting PostgreSQL container...
docker-compose up -d postgres

echo.
echo [2/6] Waiting for PostgreSQL to be ready...
set /a counter=0
:waitloop
if %counter% GEQ 30 goto timeout
docker exec fitness-postgres pg_isready -U postgres >nul 2>&1
if %errorlevel% equ 0 goto dbready
set /a counter+=1
timeout /t 2 /nobreak >nul
goto waitloop

:dbready
echo PostgreSQL is ready!
goto nextstep

:timeout
echo Warning: PostgreSQL may not be ready. Continuing anyway...

:nextstep
echo.
echo [3/6] Installing backend dependencies...
cd backend
if not exist node_modules (
    echo Running npm install for backend...
    call npm install
) else (
    echo Backend dependencies already installed.
)
cd ..

echo.
echo [4/6] Installing frontend dependencies...
cd frontend
if not exist node_modules (
    echo Running npm install for frontend...
    call npm install
) else (
    echo Frontend dependencies already installed.
)
cd ..

echo.
echo [5/6] Seeding database with initial data...
cd backend
call npx ts-node src/seed.ts
cd ..

echo.
echo [6/6] Starting backend and frontend services...
start "Fitness Backend" cmd /k "cd /d %~dp0backend && npm run start:dev"
echo Waiting for backend to start...
timeout /t 10 /nobreak >nul
start "Fitness Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================
echo   System Starting...
echo ============================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:4000/api
echo.
echo Wait a few seconds for services to fully start.
echo.
pause
