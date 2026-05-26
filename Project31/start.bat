@echo off
chcp 65001 >nul
echo ============================================
echo   Factory Access Management System
echo ============================================
echo.

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH.
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)

docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker daemon is not running.
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [INFO] Building and starting the application...
echo.

cd /d "%~dp0"
docker compose up -d --build

echo.
echo [INFO] Waiting for the service to become ready...
timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo   System is running!
echo   URL: http://localhost:8080
echo ============================================
echo.
echo To stop the system, run: docker compose down
echo To view logs, run:  docker compose logs -f
echo.

start "" http://localhost:8080
pause
