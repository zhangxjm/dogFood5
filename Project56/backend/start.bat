@echo off
echo ========================================
echo Backend Server Start Script
echo ========================================

echo Checking Node.js...
node --version

echo Installing dependencies...
call npm install

echo Building project...
call npm run build

echo Starting backend server...
call npm run start:prod

pause
