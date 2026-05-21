#!/bin/bash

echo "======================================"
echo "  社区团购团长端系统启动脚本"
echo "======================================"

echo ""
echo "检查 Docker 是否安装..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi
echo "✅ Docker 已安装"

echo ""
echo "检查 Docker Compose 是否安装..."
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi
echo "✅ Docker Compose 已安装"

echo ""
echo "启动后端服务和数据库..."
cd backend && docker-compose up -d --build

echo ""
echo "等待服务启动完成..."
sleep 15

echo ""
echo "======================================"
echo "  🎉 服务启动完成！"
echo "======================================"
echo ""
echo "后端 API 地址: http://localhost:5000"
echo "MySQL 数据库地址: localhost:3306"
echo "数据库用户名: groupbuy"
echo "数据库密码: groupbuy123"
echo ""
echo "默认登录账号: 13800138000 / 123456"
echo ""
echo "查看后端日志: cd backend && docker-compose logs -f backend"
echo "停止服务: cd backend && docker-compose down"
echo ""
