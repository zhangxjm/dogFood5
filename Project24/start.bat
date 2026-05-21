@echo off
echo ========================================
echo   户外渔具门店信息管理系统
echo ========================================

echo.
echo 正在启动 MySQL 容器...
docker compose up -d mysql

echo.
echo 等待 MySQL 启动...
timeout /t 20 /nobreak

echo.
echo 下载 Go 依赖...
go mod download

echo.
echo 启动应用服务器...
go run main.go
