@echo off
chcp 65001 >nul
echo ========================================
echo   Stopping All Services...
echo ========================================
echo.

echo Stopping Docker containers...
cd /d "%~dp0"
docker compose down

echo.
echo [OK] All services stopped.
echo.
pause
