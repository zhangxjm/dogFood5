#!/bin/bash

echo "=== 启动社区生鲜食材后台管理系统 ==="

echo "1. 启动 MySQL 容器..."
cd "$(dirname "$0")"
docker-compose up -d

echo "2. 等待 MySQL 启动..."
sleep 15

echo "3. 启动后端服务..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!

echo "4. 等待后端服务启动..."
sleep 30

echo "5. 安装前端依赖..."
cd ../frontend
npm install

echo "6. 启动前端服务..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=== 服务启动完成 ==="
echo "后端地址: http://localhost:8080"
echo "前端地址: http://localhost:3000"
echo "MySQL地址: localhost:3306"
echo "默认账号: admin / admin123"
echo ""
echo "按 Ctrl+C 停止所有服务"

wait $BACKEND_PID $FRONTEND_PID
