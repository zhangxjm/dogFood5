#!/bin/bash

echo "🚀 启动鲜花门店预订小程序..."

start_docker() {
  if command -v docker-compose &> /dev/null; then
    docker-compose up -d postgres
  else
    docker compose up -d postgres
  fi
}

stop_docker() {
  if command -v docker-compose &> /dev/null; then
    docker-compose down
  else
    docker compose down
  fi
}

echo ""
echo "📦 启动 Docker 服务（PostgreSQL）..."
start_docker

echo ""
echo "⏳ 等待数据库准备就绪..."
sleep 10

echo ""
echo "🔧 安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
  npm install
fi

echo ""
echo "🟢 启动后端服务..."
npm run start:dev &
BACKEND_PID=$!

cd ..

echo ""
echo "📱 安装前端依赖..."
cd frontend
if [ ! -d "node_modules" ]; then
  npm install
fi

echo ""
echo "🎨 启动前端服务（H5）..."
npm run dev:h5 &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ 服务启动完成！"
echo "📋 后端 API: http://localhost:3000"
echo "📋 API 文档: http://localhost:3000/api"
echo "📋 前端 H5: http://localhost:5173"
echo ""
echo "💡 按 Ctrl+C 停止所有服务"

wait $BACKEND_PID $FRONTEND_PID
