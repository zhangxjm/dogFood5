@echo off
chcp 65001 >nul
echo ============================================
echo   Hotel Linen Management System Startup
echo ============================================
echo.

echo [1/4] Starting MySQL container...
cd /d "%~dp0docker"
docker-compose up -d
if %errorlevel% neq 0 (
    echo Failed to start MySQL. Please ensure Docker is running.
    pause
    exit /b 1
)
echo MySQL container started successfully.
echo.

echo [2/4] Waiting for MySQL to be ready...
timeout /t 15 /nobreak >nul
echo.

echo [3/4] Starting Spring Boot backend...
cd /d "%~dp0backend"
start "Hotel Linen Backend" cmd /k "mvn spring-boot:run"
echo Backend starting on port 8080...
echo.

echo [4/4] Starting Vue frontend...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
start "Hotel Linen Frontend" cmd /k "npm run dev"
echo Frontend starting on port 5173...
echo.

echo ============================================
echo   Startup Complete!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo ============================================
echo.
pause
