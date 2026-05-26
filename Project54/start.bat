@echo off
echo ========================================
echo Dormitory Management System - Startup
echo ========================================
echo.

echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop first
    pause
    exit /b 1
)
echo Docker is available
echo.

echo [2/5] Starting MySQL container...
docker-compose up -d mysql
if %errorlevel% neq 0 (
    echo ERROR: Failed to start MySQL container
    pause
    exit /b 1
)
echo MySQL container started
echo.

echo [3/5] Waiting for MySQL to be ready...
timeout /t 15 /nobreak >nul
echo MySQL should be ready now
echo.

echo [4/4] Starting backend service...
cd backend
if not exist "go.sum" (
    echo Downloading Go dependencies...
    go mod download
    if %errorlevel% neq 0 (
        echo ERROR: Failed to download dependencies
        pause
        exit /b 1
    )
)

echo Building and running application...
go run main.go
if %errorlevel% neq 0 (
    echo ERROR: Failed to start application
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo Application started successfully!
echo Open http://localhost:8080 in your browser
echo ========================================
pause
