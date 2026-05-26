@echo off
chcp 65001 >nul
echo ========================================
echo   Stopping Stall Management System
echo ========================================
echo.

docker compose down

echo.
echo All services stopped.
echo.
pause
