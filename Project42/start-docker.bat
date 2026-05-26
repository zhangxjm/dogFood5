@echo off
echo ============================================
echo   Door-Window System - Docker Deploy
echo ============================================
echo.

echo [INFO] Checking Docker...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed.
    echo [INFO] Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [INFO] Docker version:
docker --version
echo.

if not exist "data" mkdir data

echo [INFO] Building and starting containers...
docker-compose up -d --build

echo.
echo ============================================
echo [INFO] Service started successfully!
echo [INFO] Access URL: http://localhost:8080
echo [INFO] View logs: docker-compose logs -f
echo [INFO] Stop service: docker-compose down
echo ============================================
echo.

pause
