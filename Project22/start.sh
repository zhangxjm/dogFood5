#!/bin/bash

echo "========================================"
echo "  自习室座位预约管理系统 - 启动脚本"
echo "========================================"
echo ""

echo "检查 Docker 和 Docker Compose..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

echo "停止并删除旧容器（如果存在）..."
docker-compose down 2>/dev/null || true
echo ""

echo "构建并启动所有服务..."
docker-compose up -d --build
echo ""

echo "等待服务启动完成..."
sleep 10

echo ""
echo "检查服务状态..."
docker-compose ps
echo ""

echo "========================================"
echo "  🎉 系统启动完成！"
echo "========================================"
echo ""
echo "📚 访问地址："
echo "   - 前端界面: http://localhost:3000"
echo "   - 后端API:  http://localhost:8000"
echo "   - API文档:  http://localhost:8000/docs"
echo ""
echo "💡 查看日志: docker-compose logs -f"
echo "💡 停止服务: docker-compose down"
echo ""
