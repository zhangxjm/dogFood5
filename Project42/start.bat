@echo off
echo ============================================
echo   Door-Window Installation Work Order System
echo ============================================
echo.

echo [INFO] Checking Go environment...
where go >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Go is not installed. Please install Go first.
    echo [INFO] Download from: https://go.dev/dl/
    pause
    exit /b 1
)

echo [INFO] Go version:
go version
echo.

echo [INFO] Downloading dependencies...
go mod download
if %errorlevel% neq 0 (
    echo [ERROR] Failed to download dependencies.
    pause
    exit /b 1
)

echo [INFO] Dependencies downloaded successfully.
echo.

echo [INFO] Building application...
go build -o door-window-system.exe .
if %errorlevel% neq 0 (
    echo [ERROR] Build failed.
    pause
    exit /b 1
)

echo [INFO] Build successful.
echo.

echo ============================================
echo [INFO] Starting server...
echo [INFO] Server will be available at: http://localhost:8080
echo [INFO] Press Ctrl+C to stop the server.
echo ============================================
echo.

door-window-system.exe
pause
