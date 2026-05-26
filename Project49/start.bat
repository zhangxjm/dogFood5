@echo off
echo ========================================
echo   Moving Service Management System
echo ========================================
echo.
echo [1/5] Checking Docker...
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker not found. Please install Docker Desktop first.
    pause
    exit /b 1
)
echo [OK] Docker is available.

echo.
echo [2/5] Checking Docker Compose...
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose not found.
    pause
    exit /b 1
)
echo [OK] Docker Compose is available.

echo.
echo [3/5] Stopping existing containers...
docker compose down 2>nul
echo [OK] Old containers cleaned.

echo.
echo [4/5] Building and starting services...
docker compose build --no-cache
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
docker compose up -d
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start containers!
    pause
    exit /b 1
)

echo.
echo [5/5] Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo   Frontend: http://localhost:8080
echo   Backend:  http://localhost:3000
echo   Health:   http://localhost:3000/api/health
echo ========================================
echo.
echo To stop services, run: docker compose down
echo To view logs, run: docker compose logs -f
echo.
pause
