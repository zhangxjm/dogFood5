@echo off
chcp 65001 >nul
echo 🚀 正在启动仓库物料管理系统...

echo 📦 启动 Docker 容器...
docker-compose up -d

echo ⏳ 等待 MySQL 启动...
timeout /t 15 /nobreak

echo 📦 初始化数据库...
docker exec -i warehouse-mysql mysql -uroot -proot123456 < docs/sql/init.sql

echo 🔧 下载 Go 依赖...
go mod tidy

echo 🚀 启动应用服务...
echo 📱 访问地址: http://localhost:8080
echo 🔌 API 地址: http://localhost:8080/api

go run main.go
