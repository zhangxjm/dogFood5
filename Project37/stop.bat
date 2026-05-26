@echo off

echo ============================================
echo   Fitness Plan Management System - Stop
echo ============================================
echo.

echo Stopping Docker containers...
docker-compose down

echo.
echo All services stopped.
echo.

pause
