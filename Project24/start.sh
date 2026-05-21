#!/bin/bash

echo "========================================"
echo "  户外渔具门店信息管理系统"
echo "========================================"

echo ""
echo "正在启动 MySQL 容器..."
docker compose up -d mysql

echo ""
echo "等待 MySQL 完全启动..."
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker exec fishing-mysql mysqladmin ping -h localhost -uroot -p123456 --silent 2>/dev/null; then
        echo "MySQL 已就绪！"
        break
    fi
    echo "等待 MySQL... (尝试 $attempt/$max_attempts)"
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "警告: MySQL 启动超时，但继续尝试连接..."
fi

echo ""
echo "下载 Go 依赖..."
go mod download

echo ""
echo "启动应用服务器..."
go run main.go
