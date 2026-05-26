@echo off
chcp 65001 >nul
echo Stopping Nail Salon Schedule System...
docker compose down
echo Services stopped.
pause
