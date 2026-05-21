#!/bin/bash

echo "=========================================="
echo "       在线投票系统 - 启动脚本"
echo "=========================================="

# 检查Java版本
echo ""
echo "检查Java环境..."
if ! command -v java &> /dev/null; then
    echo "❌ 未找到Java，请安装JDK 17或更高版本"
    exit 1
fi
java_version=$(java -version 2>&1 | head -1 | awk -F'"' '{print $2}' | cut -d'.' -f1)
if [ "$java_version" -lt 17 ]; then
    echo "⚠️  检测到Java版本较低，建议使用JDK 17或更高版本"
else
    echo "✅ Java版本检查通过"
fi

# 检查Maven
echo ""
echo "检查Maven环境..."
if ! command -v mvn &> /dev/null; then
    echo "❌ 未找到Maven，请安装Maven"
    exit 1
fi
echo "✅ Maven版本检查通过"

# 检查Node.js
echo ""
echo "检查Node.js环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请安装Node.js 16或更高版本"
    exit 1
fi
echo "✅ Node.js版本检查通过"

# 启动后端
echo ""
echo "=========================================="
echo "启动后端服务..."
echo "=========================================="
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo ""
echo "等待后端服务启动..."
sleep 20

# 启动前端
echo ""
echo "=========================================="
echo "启动前端服务..."
echo "=========================================="
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "服务启动完成！"
echo "=========================================="
echo "后端地址: http://localhost:8080"
echo "前端地址: http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo ''; echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
