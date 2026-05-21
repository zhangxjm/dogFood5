#!/bin/bash

echo "========================================="
echo "  五金小店商品台账管理系统 - 启动脚本"
echo "========================================="

echo ""
echo "1. 启动 MySQL 数据库容器..."
docker-compose up -d

echo ""
echo "2. 等待数据库准备就绪..."
sleep 15

echo ""
echo "3. 启动 Go 应用服务器..."
go run main.go
