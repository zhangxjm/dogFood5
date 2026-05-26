@echo off
echo 正在停止服务...
taskkill /fi "WINDOWTITLE eq GiftList-Backend*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq GiftList-Frontend*" /f >nul 2>&1
docker rm -f gift-list-mongo >nul 2>&1
echo 服务已停止
pause
