@echo off
chcp 65001 >nul
echo ========================================
echo   Agricultural Tool Management System
echo   Starting Services...
echo ========================================
echo.

echo [1/3] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not running.
    echo Please install Docker first: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [2/3] Starting MySQL and Application...
docker-compose up -d --build

echo.
echo [3/3] Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo   Application URL: http://localhost:8080
echo   MySQL Port: 3306
echo.
echo   To stop services, run: docker-compose down
echo   To view logs, run: docker-compose logs -f
echo.
echo ========================================

pause
