#!/bin/bash

echo "========================================"
echo "  零食批发进销存系统启动脚本"
echo "========================================"
echo ""

echo "检查Docker是否安装..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

echo "检查Docker Compose是否安装..."
if ! command -v docker compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

echo ""
echo "🚀 开始启动服务..."
echo ""

if command -v docker compose &> /dev/null; then
    docker compose up -d --build
else
    docker compose up -d --build
fi

echo ""
echo "⏳ 等待服务启动..."
sleep 10

echo ""
echo "========================================"
echo "✅ 服务启动完成！"
echo "========================================"
echo ""
echo "🌐 前端地址: http://localhost:5173"
echo "🔧 后端API地址: http://localhost:3000"
echo "💾 MySQL端口: 3307"
echo ""
echo "查看日志命令:"
echo "  docker compose logs -f backend  # 查看后端日志"
echo "  docker compose logs -f frontend # 查看前端日志"
echo "  docker compose logs -f mysql    # 查看数据库日志"
echo ""
echo "停止服务命令:"
echo "  docker compose down"
echo ""