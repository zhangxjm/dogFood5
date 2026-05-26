@echo off
echo Starting River Inspection System...
echo.

echo Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not installed or not running. Please install Docker first.
    pause
    exit /b 1
)

echo.
echo Building and starting containers...
docker-compose up -d --build

echo.
echo Waiting for services to start...
timeout /t 20 /nobreak >nul

echo.
echo ========================================
echo River Inspection System is ready!
echo Please visit: http://localhost:8080
echo ========================================
echo.
echo To stop the system, run: stop.bat
pause
