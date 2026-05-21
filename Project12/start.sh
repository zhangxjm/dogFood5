#!/bin/bash

echo "=================================="
echo "  工地材料领用管理系统 - 启动脚本"
echo "=================================="
echo ""

echo "📦 正在启动 MySQL 容器..."
docker compose up -d

echo ""
echo "⏳ 等待 MySQL 初始化完成（约 20 秒）..."
sleep 20

echo ""
echo "🔧 正在启动后端服务..."
cd backend
go mod download
gnome-terminal -- bash -c "go run main.go; exec bash" 2>/dev/null || open -a Terminal "go run main.go" 2>/dev/null &

echo ""
echo "🌐 正在启动前端服务..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &

echo ""
echo "=================================="
echo "  系统启动中，请稍候..."
echo ""
echo "  前端地址: http://localhost:3000"
echo "  后端地址: http://localhost:8080"
echo "  MySQL:    localhost:3306"
echo "=================================="
