@echo off
echo ========================================
echo   Starting Notes Application with Docker
echo ========================================
echo.

cd /d "%~dp0"

if not exist "data" mkdir data

echo [1/2] Building Docker image...
docker-compose build

echo [2/2] Starting containers...
echo.
echo ========================================
echo   Server is running at: http://localhost:8000
echo   Press Ctrl+C to stop
echo ========================================
echo.

docker-compose up
