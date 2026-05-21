#!/bin/bash

echo "=============================================="
echo "    办公文具批量采购管理平台 - 启动脚本"
echo "=============================================="

echo ""
echo "1. 启动 Docker 服务 (MySQL & Redis)..."
docker-compose up -d

echo ""
echo "2. 等待 MySQL 启动 (30秒)..."
sleep 30

echo ""
echo "3. 编译并启动 Spring Boot 后端..."
cd backend
mvn clean package -DskipTests
java -jar target/stationery-purchase-1.0.0.jar &
BACKEND_PID=$!

echo ""
echo "4. 等待后端启动 (20秒)..."
sleep 20

echo ""
echo "5. 安装前端依赖并启动 Vue 前端..."
cd ../frontend
npm install
npm run dev &

echo ""
echo "=============================================="
echo "    服务启动完成！"
echo "=============================================="
echo "后端地址: http://localhost:8080/api"
echo "前端地址: http://localhost:3000"
echo "MySQL端口: 3306"
echo ""
echo "按 Ctrl+C 停止前端服务"
echo "如需停止后端和Docker，请执行: ./stop.sh"
echo "=============================================="

wait
