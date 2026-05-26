@echo off
chcp 65001 >nul

echo ============================================
echo   停止少儿绘画课时记录系统
echo ============================================
echo.

cd /d "%~dp0"

echo 正在停止服务...
docker compose down

echo.
echo 服务已停止
echo.

pause
