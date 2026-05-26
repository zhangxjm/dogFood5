@echo off
setlocal enabledelayedexpansion
echo ========================================
echo JuShaS Management System Startup Script
echo ========================================

echo [1/6] Starting MySQL container...
cd docker
docker-compose up -d
cd ..

echo [2/6] Waiting for MySQL to be ready...
set "MYSQL_READY=0"
for /L %%i in (1,1,40) do (
    docker exec jushas-mysql mysqladmin ping -h localhost -u root -pjushas123 >nul 2>&1
    if !errorlevel! equ 0 (
        set "MYSQL_READY=1"
        echo MySQL is ready!
        goto :mysql_ready
    )
    echo Waiting... %%i/40
    timeout /t 2 /nobreak >nul
)
:mysql_ready

if "%MYSQL_READY%"=="0" (
    echo Warning: MySQL may not be fully ready, continuing...
)

echo [3/6] Building backend...
cd backend
if not exist target\jushas-manager-1.0.0.jar (
    set MAVEN_OPTS=-Xmx512m -Xms256m
    call mvn clean package -DskipTests
)

echo [4/6] Cleaning old backend process...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

echo [5/6] Starting backend server...
start "JuShaS-Backend" javaw -Xmx256m -Xms128m -jar target/jushas-manager-1.0.0.jar

echo Waiting for backend to start...
for /L %%i in (1,1,25) do (
    netstat -aon | findstr ":8080" | findstr LISTENING >nul
    if !errorlevel! equ 0 (
        echo Backend is ready!
        goto :backend_ready
    )
    echo Waiting... %%i/25
    timeout /t 2 /nobreak >nul
)
:backend_ready

echo [6/6] Starting frontend...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

echo Cleaning old frontend process...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

echo Starting frontend dev server...
start "JuShaS-Frontend" cmd /c "npm run dev"

echo ========================================
echo All services are starting!
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo ========================================
timeout /t 5 /nobreak
endlocal
