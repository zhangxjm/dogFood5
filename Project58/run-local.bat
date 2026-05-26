@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo River Inspection System - Local Mode
echo ========================================
echo.

echo Checking Go environment...
where go >nul 2>&1
if %errorlevel% neq 0 (
    echo Go is not installed. Please install Go first.
    echo Download from: https://golang.org/dl/
    pause
    exit /b 1
)

echo Go version:
go version
echo.

cd /d "%~dp0backend"

echo Setting Go proxy...
set GOPROXY=https://goproxy.cn,direct

echo Downloading dependencies...
go mod tidy
if %errorlevel% neq 0 (
    echo Failed to download dependencies.
    pause
    exit /b 1
)

echo.
echo Building application...
go build -o inspection-server.exe .
if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b 1
)

echo.
echo Starting server...
echo Please visit: http://localhost:8080
echo Press Ctrl+C to stop the server.
echo.

set DB_TYPE=sqlite
set DB_PATH=./data/inspection.db
set SERVER_PORT=8080

inspection-server.exe

pause
