@echo off
chcp 65001 >nul
echo ============================================
echo   Warehouse Management System - Start Script
echo ============================================

echo.
echo [1/3] Checking Docker environment...
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

echo Docker environment is ready.

echo.
echo [2/3] Starting services with Docker Compose...
cd /d "%~dp0"

docker compose down
docker compose up -d --build

if %errorlevel% neq 0 (
    echo Error: Failed to start services.
    pause
    exit /b 1
)

echo.
echo [3/3] Waiting for services to be ready...

echo Waiting for MySQL to be healthy...
set MAX_RETRIES=30
set RETRY=0
:wait_mysql
if %RETRY% geq %MAX_RETRIES% goto timeout
docker compose ps mysql 2>nul | findstr "healthy" >nul
if %errorlevel% equ 0 (
    echo MySQL is healthy!
    goto app_wait
)
set /a RETRY+=1
echo   Retry %RETRY%/%MAX_RETRIES%...
timeout /t 2 /nobreak >nul
goto wait_mysql

:timeout
echo Warning: MySQL health check timeout. The service may still be starting.

:app_wait
echo Waiting for application to start...
timeout /t 5 /nobreak >nul

echo.
echo ============================================
echo   Services Started Successfully!
echo ============================================
echo.
echo   Application URL: http://localhost:8080
echo   MySQL Port: 3306
echo.
echo   To view logs: run 'docker compose logs -f'
echo   To stop services: run stop.bat
echo ============================================
pause
