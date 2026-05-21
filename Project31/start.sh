#!/bin/bash

echo "🔐 正在启动密码保险箱..."

if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

echo "🚀 启动服务..."
echo "📱 访问地址: http://localhost:3000"
echo "💡 按 Ctrl+C 停止服务"

node server.js
