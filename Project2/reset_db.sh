#!/bin/bash

echo "停止并删除旧容器..."
docker-compose down -v

echo "等待2秒..."
sleep 2

echo "重新启动数据库..."
docker-compose up -d mysql

echo "等待 MySQL 启动完成 (约15秒)..."
sleep 15

echo "数据库重置完成！"
echo "现在可以重新启动后端服务了。"
