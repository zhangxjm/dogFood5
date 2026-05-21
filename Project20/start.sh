#!/bin/bash

echo "🚗 驾校练车预约系统 - 启动脚本"
echo "================================="

echo ""
echo "📦 启动 Docker 服务 (MySQL + Redis)..."
docker compose up -d

echo ""
echo "⏳ 等待 MySQL 启动..."
sleep 15

echo ""
echo "🔧 初始化后端依赖..."
cd backend
go mod tidy

echo ""
echo "🚀 启动后端服务 (端口: 8080)..."
go run main.go &
BACKEND_PID=$!

echo ""
echo "⏳ 等待后端服务启动..."
sleep 3

echo ""
echo "📱 初始化前端依赖..."
cd ../frontend
npm install

echo ""
echo "🌐 启动前端服务 (端口: 3000)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "⏳ 等待前端服务启动..."
sleep 3

echo ""
echo "================================="
echo "✅ 系统启动完成！"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8080"
echo "💾 MySQL: localhost:3306 (root/root123456)"
echo "📊 Redis: localhost:6379"
echo ""
echo "📝 预置数据:"
echo "   - 教练: 张教练、李教练、王教练"
echo "   - 学员: 学员小明、学员小红"
echo ""
echo "⚠️  按 Ctrl+C 停止所有服务"
echo "================================="

wait $BACKEND_PID $FRONTEND_PID
