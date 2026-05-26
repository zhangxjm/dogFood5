@echo off
chcp 65001 >nul
echo ========================================
echo   Street Stall Sales Management System
echo   Starting...
echo ========================================
echo.

echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not running.
    echo Please install Docker Desktop first: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo Docker is ready.

echo.
echo [2/5] Checking Docker Compose...
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker Compose is not available.
    pause
    exit /b 1
)
echo Docker Compose is ready.

echo.
echo [3/5] Pulling required images...
echo Note: If you see "anonymous token" errors, run: docker login
docker pull mysql:8.0
docker pull maven:3.8.4-openjdk-11-slim
docker pull node:18-alpine
docker pull nginx:alpine

echo.
echo [4/5] Starting MySQL database...
echo Waiting for MySQL to initialize (this may take 30-60 seconds on first run)...
docker compose up -d mysql

echo Waiting 30 seconds for MySQL to be ready...
timeout /t 30 /nobreak >nul

echo.
echo [5/5] Building and starting all services...
docker compose up -d --build

echo.
echo ========================================
echo   Startup Complete!
echo ========================================
echo.
echo Frontend URL: http://localhost:5173
echo Backend API: http://localhost:8080/api
echo.
echo To check status: docker compose ps
echo To view logs:   docker compose logs -f
echo To stop:        docker compose down
echo.
echo If pull fails, login first: docker login
echo.
echo Opening browser...
start http://localhost:5173
echo.
pause
