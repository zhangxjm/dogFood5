@echo off
chcp 65001 >nul
echo ========================================
echo   Enterprise Afternoon Tea System
echo ========================================
echo.

echo [1/4] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not running.
    echo Please install Docker Desktop and start it first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not available.
    pause
    exit /b 1
)

echo [2/4] Building and starting services...
docker-compose up -d --build

echo [3/4] Waiting for services to start...
timeout /t 30 /nobreak >nul

echo [4/4] Checking service status...
docker-compose ps

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8080/api
echo.
echo   To stop services: docker-compose down
echo   To view logs: docker-compose logs -f
echo.
pause
