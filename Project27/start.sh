#!/bin/bash

echo "🚀 启动节日礼品清单管理系统..."

echo "📦 检查 Docker 是否运行..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

echo "🔨 构建并启动 Docker 容器..."
docker-compose up -d --build

echo "⏳ 等待服务启动..."
sleep 10

echo "✅ 系统启动完成！"
echo "🌐 前端地址: http://localhost:3000"
echo "🔌 后端API: http://localhost:5000"
echo "📊 健康检查: http://localhost:5000/api/health"
echo ""
echo "📝 查看日志: docker-compose logs -f"
echo "⏹️  停止服务: docker-compose down"
