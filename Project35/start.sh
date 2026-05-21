#!/bin/bash

echo "🚀 正在启动同城绿植养护服务预约系统..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 请先安装 Docker: https://www.docker.com/get-started"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ 请先安装 Docker Compose"
    exit 1
fi

echo "📦 构建并启动服务..."
docker-compose up -d --build

echo "⏳ 等待服务启动..."
sleep 10

echo "✅ 服务启动完成!"
echo ""
echo "🌐 前端地址: http://localhost:5173"
echo "🔧 后端地址: http://localhost:3000"
echo ""
echo "📝 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down"
