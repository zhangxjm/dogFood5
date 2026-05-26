@echo off

echo ===============================================
echo   Document Circulation System - Stopping...
echo ===============================================
echo.

cd /d "%~dp0"

docker compose down

echo.
echo All services stopped.
echo.
pause
