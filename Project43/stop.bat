@echo off
chcp 65001 >nul
echo ========================================
echo   Stopping Afternoon Tea System
echo ========================================
echo.

echo Stopping services...
docker-compose down

echo.
echo Services stopped successfully.
echo.
pause
