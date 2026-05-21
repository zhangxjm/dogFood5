#!/bin/bash

echo "=============================================="
echo "  母婴实体店会员信息管理系统 - 一键启动"
echo "=============================================="
echo ""

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未检测到Docker，请先安装Docker"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ 错误: 未检测到Docker Compose，请先安装Docker Compose"
    exit 1
fi

echo "✅ Docker环境检查通过"
echo ""

# 停止并移除旧容器
echo "🔄 清理旧容器..."
if command -v docker-compose &> /dev/null; then
    docker-compose down 2>/dev/null
else
    docker compose down 2>/dev/null
fi
echo "✅ 清理完成"
echo ""

# 启动服务
echo "🚀 正在启动服务（首次启动可能需要5-10分钟，请耐心等待）..."
echo ""

if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
else
    docker compose up -d --build
fi

echo ""
echo "⏳ 等待服务启动完成..."
sleep 30

# 检查服务状态
echo ""
echo "📊 服务状态检查:"
if command -v docker-compose &> /dev/null; then
    docker-compose ps
else
    docker compose ps
fi

echo ""
echo "=============================================="
echo "  🎉 系统启动完成！"
echo "=============================================="
echo ""
echo "  前端地址: http://localhost:3000"
echo "  后端API:  http://localhost:8080"
echo "  MySQL:    localhost:3306"
echo "  数据库:   babycare_member"
echo "  用户名:   root"
echo "  密码:     123456"
echo ""
echo "  查看日志命令:"
echo "    后端: docker logs -f babycare-backend"
echo "    前端: docker logs -f babycare-frontend"
echo "    数据库: docker logs -f babycare-mysql"
echo ""
echo "  停止服务命令: ./stop.sh"
echo "=============================================="