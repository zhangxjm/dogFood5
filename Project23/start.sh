#!/bin/bash

echo "🚀 启动宠物用品门店管理系统..."

echo "📦 安装后端依赖..."
cd backend
npm install

echo "📦 安装前端依赖..."
cd ../frontend
npm install

echo "🔨 构建前端..."
npm run build

echo "🟢 启动后端服务..."
cd ../backend
npm start &
BACKEND_PID=$!

echo "⏳ 等待后端启动完成..."
sleep 3

echo "🟢 启动前端开发服务..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 系统启动完成！"
echo "🌐 前端地址: http://localhost:5173"
echo "🔌 后端API: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务"

wait $FRONTEND_PID $BACKEND_PID
