#!/bin/bash

echo "🚀 启动酒店预订系统..."

echo "🧹 清理旧容器和数据卷..."
docker compose down -v

echo "📦 构建并启动 Docker 容器..."
docker compose up -d --build

echo "⏳ 等待服务启动..."
sleep 20

echo "✅ 系统启动完成！"
echo ""
echo "📋 访问地址："
echo "   前端: http://localhost:3000"
echo "   后端 API: http://localhost:8000"
echo "   API 文档: http://localhost:8000/docs"
echo ""
echo "📝 查看日志: docker compose logs -f"
echo "🛑 停止系统: docker compose down"
