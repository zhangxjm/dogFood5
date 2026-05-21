#!/bin/bash

echo "========================================="
echo "  书画作品展示平台 - 启动脚本"
echo "========================================="
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否可用
if ! docker compose version &> /dev/null; then
    echo "❌ 错误: Docker Compose 不可用，请检查 Docker 安装"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

# 创建必要的目录
mkdir -p uploads
echo "✅ 目录创建完成"
echo ""

# 构建并启动服务
echo "🚀 开始构建并启动服务..."
echo ""

docker compose up -d --build

echo ""
echo "⏳ 等待服务启动..."
sleep 10

echo ""
echo "========================================="
echo "  ✅ 服务启动成功！"
echo "========================================="
echo ""
echo "🌐 前端访问地址: http://localhost:3000"
echo "🔧 后端API地址: http://localhost:5000"
echo ""
echo "📝 查看日志命令: docker compose logs -f"
echo "⏹️  停止服务命令: docker compose down"
echo ""
