#!/bin/bash

echo "========================================"
echo "  企业饮用水管理系统 - 一键启动脚本"
echo "========================================"
echo ""

echo "1. 检查环境..."
java -version > /dev/null 2>&1 || { echo "❌ Java 未安装，请先安装 JDK 17+"; exit 1; }
node -v > /dev/null 2>&1 || { echo "❌ Node.js 未安装，请先安装 Node.js"; exit 1; }
docker --version > /dev/null 2>&1 || { echo "❌ Docker 未安装，请先安装 Docker"; exit 1; }
echo "✅ 环境检查通过"
echo ""

echo "2. 启动 MySQL 数据库..."
docker-compose up -d mysql
echo "等待 MySQL 启动中..."
sleep 15
echo "✅ MySQL 已启动"
echo ""

echo "3. 构建并启动后端..."
cd backend
if [ ! -d "target" ]; then
    echo "首次运行 Maven 构建中..."
    mvn clean package -DskipTests
fi
echo "后端启动中..."
mvn spring-boot:run &
BACKEND_PID=$!
cd ..
sleep 10
echo "✅ 后端已启动 (端口: 8080"
echo ""

echo "4. 安装前端依赖并启动..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "安装 npm 依赖中..."
    npm install
fi
echo "前端启动中..."
npm run dev &
FRONTEND_PID=$!
cd ..
sleep 5
echo ""

echo "========================================"
echo "  系统启动完成！"
echo "========================================"
echo "📊 前端地址: http://localhost:5173"
echo "🔧 后端地址: http://localhost:8080"
echo "🗄️  数据库: localhost:3306/water_db"
echo "   用户名: root"
echo "   密码: 123456"
echo ""
echo "按 Ctrl+C 停止所有服务"

wait $BACKEND_PID $FRONTEND_PID