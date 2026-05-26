@echo off
chcp 65001 >nul
echo ========================================
echo   Nail Salon Schedule System - Start
echo ========================================
echo.

echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not running
    pause
    exit /b 1
)

echo [2/5] Cleaning old containers...
docker compose down 2>nul

echo [3/5] Cleaning old images (optional)...
docker image prune -f 2>nul

echo [4/5] Starting services...
docker compose up -d --build

echo [5/5] Waiting for services to be ready...
echo This may take 30-60 seconds for first build...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo   System started successfully!
echo   Frontend: http://localhost
echo   Backend:  http://localhost:8080
echo.
echo   If you see errors, run:
echo   docker compose logs -f
echo ========================================
echo.
pause
