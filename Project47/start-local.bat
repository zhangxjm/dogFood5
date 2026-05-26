@echo off
chcp 65001 >nul
echo ========================================
echo   Nail Salon Schedule System - Local Start
echo ========================================
echo.

echo [1/4] Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Java is not installed
    pause
    exit /b 1
)

echo [2/4] Checking Maven...
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Maven is not installed
    pause
    exit /b 1
)

echo [3/4] Building backend...
cd backend
call mvn clean package -DskipTests -q
if %errorlevel% neq 0 (
    echo Error: Build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo [4/4] Starting backend server...
echo Please ensure MySQL is running on localhost:3306
echo Database: nail_schedule, User: root, Password: root123
echo.
start "Nail Schedule Backend" java -jar backend/target/nail-schedule-1.0.0.jar

echo Waiting for backend to start...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   Backend started!
echo   API: http://localhost:8080/api
echo   Frontend: Open frontend/index.html in browser
echo ========================================
echo.
pause
