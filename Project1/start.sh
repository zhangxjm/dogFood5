#!/bin/bash

echo "🚀 正在启动快递驿站取件系统..."

echo ""
echo "📦 1/3 启动 MongoDB (Docker)..."
if ! docker-compose up -d mongodb 2>/dev/null; then
    echo "⚠️  Docker未启动或未安装，请确保本地MongoDB已运行"
fi

sleep 3

echo ""
echo "🔧 2/3 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

echo ""
echo "🖥️  3/3 启动后端服务..."
npm run dev &
BACKEND_PID=$!

cd ..

echo ""
echo "✅ 后端服务已启动: http://localhost:3000"
echo ""
echo "📱 启动前端服务（新开终端）："
echo "   cd frontend && npm run dev"
echo ""
echo "🛑 停止服务请按 Ctrl+C"

wait $BACKEND_PID
