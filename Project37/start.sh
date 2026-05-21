#!/bin/bash

echo "========================================="
echo "  企业内部文件传阅系统 - 启动脚本"
echo "========================================="

echo ""
echo "1. 启动 MySQL 数据库容器..."
docker-compose up -d mysql

echo ""
echo "等待 MySQL 启动完成（约 15 秒）..."
sleep 15

echo ""
echo "2. 构建并启动后端服务..."
cd backend
mvn clean package -DskipTests -q
java -jar target/file-circulation-system-1.0.0.jar &
BACKEND_PID=$!
cd ..

echo ""
echo "等待后端服务启动（约 10 秒）..."
sleep 10

echo ""
echo "3. 安装前端依赖并启动前端服务..."
cd frontend
npm install -q
npm run serve &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================="
echo "  系统启动完成！"
echo "  前端地址: http://localhost:3000"
echo "  后端地址: http://localhost:8080"
echo ""
echo "  测试账号: admin / 123456"
echo "========================================="
echo ""
echo "按 Ctrl+C 停止所有服务"

wait $BACKEND_PID $FRONTEND_PID
