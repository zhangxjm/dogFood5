@echo off
chcp 65001 >nul
echo ============================================
echo   Warehouse Management System - Stop Script
echo ============================================

echo.
echo Stopping services...
cd /d "%~dp0"

docker compose down

if %errorlevel% equ 0 (
    echo.
    echo Services stopped successfully.
) else (
    echo.
    echo Error: Failed to stop services.
)

pause
