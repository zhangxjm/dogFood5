@echo off
chcp 65001 >nul
echo ============================================
echo   Hard Pen Calligraphy Check-in System
echo   Starting...
echo ============================================

if not exist "uploads" mkdir uploads

echo [1/2] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker not found. Please install Docker first.
    echo Download: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker is ready!

echo [2/2] Starting services...
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo Failed to start services!
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Services started successfully!
echo ============================================
echo.
echo   Frontend: http://localhost:8000/frontend/
echo   API Docs: http://localhost:8000/docs
echo.
echo   To stop: run stop.bat
echo ============================================
echo.
pause
