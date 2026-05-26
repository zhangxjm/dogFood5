@echo off
chcp 65001 >nul
echo ========================================
echo   Orchard Reservation System Start Script
echo ========================================
echo.

echo [1/3] Starting MySQL database...
docker compose up -d mysql

echo Waiting for MySQL to be ready...
timeout /t 15 /nobreak >nul

echo.
echo [2/3] Building Spring Boot backend...
cd backend
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Starting Spring Boot application...
start "Orchard Backend" java -jar backend/target/orchard-backend-1.0.0.jar

echo.
echo ========================================
echo   Startup complete!
echo   Backend API: http://localhost:8080/api
echo   Database: localhost:3306/orchard
echo ========================================
echo.
echo To start the frontend, go to the frontend directory and run:
echo   npm install
echo   npm run dev:h5
echo.
pause
