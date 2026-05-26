@echo off
echo ========================================
echo JuShaS Management System Stop Script
echo ========================================

echo Stopping MySQL container...
cd docker
docker-compose down -v
cd ..

echo Killing Java process...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Killing Node process...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo All services stopped.
timeout /t 3 /nobreak
