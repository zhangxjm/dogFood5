#!/bin/bash

echo "🚀 启动健身计划管理系统..."

echo ""
echo "📦 检查 Docker 是否安装..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

echo "✅ Docker 已安装"

echo ""
echo "🔧 构建并启动所有服务..."
docker-compose up -d --build

echo ""
echo "⏳ 等待服务启动..."
sleep 10

echo ""
echo "📊 检查服务状态..."
docker-compose ps

echo ""
echo "✅ 服务启动完成！"
echo ""
echo "🌐 访问地址："
echo "   - 前端页面: http://localhost:5173"
echo "   - 后端 API: http://localhost:3000/api"
echo "   - API 文档: http://localhost:3000/api/docs"
echo ""
echo "📝 查看日志: docker-compose logs -f"
echo "🛑 停止服务: docker-compose down"
echo ""
