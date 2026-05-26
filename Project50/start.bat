@echo off
chcp 65001 >nul

echo ========================================
echo   Campus Express Pickup System
echo   Starting Services...
echo ========================================
echo.

echo [1/3] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker not found. Please install Docker Desktop first.
    pause
    exit /b 1
)
echo Docker is ready.
echo.

echo [2/3] Starting MySQL container...
docker-compose up -d mysql
echo Waiting for MySQL to be ready...
timeout /t 15 /nobreak >nul
echo MySQL started.
echo.

echo [3/3] Starting Go application...
if not exist "go.sum" (
    echo Initializing Go modules...
    go mod tidy
)

if not exist "campus-express.exe" (
    echo Building application...
    go build -o campus-express.exe .
)

echo Launching application...
start "Campus Express System" cmd /k "campus-express.exe"

timeout /t 5 /nobreak >nul
echo.
echo ========================================
echo   System Started!
echo   URL: http://localhost:8080
echo ========================================
echo.
echo Press Ctrl+C in the application window to stop.
pause
