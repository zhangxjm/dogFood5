@echo off
echo ========================================
echo Music School Booking System - Docker Start
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Docker installation...
docker --version
if %errorlevel% neq 0 (
    echo Docker is not installed or not running.
    echo Please install Docker Desktop and start it first.
    pause
    exit /b 1
)

echo.
echo Creating data directory...
if not exist "backend\data" (
    mkdir backend\data
)

echo.
echo Building and starting containers...
docker-compose up -d --build

echo.
echo Waiting for service to start...
timeout /t 10 /nobreak

echo.
echo ========================================
echo Service started successfully!
echo ========================================
echo.
echo Application URL: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.

pause
