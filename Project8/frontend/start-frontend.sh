#!/bin/bash

echo "======================================"
echo "  社区团购团长端 - 前端启动"
echo "======================================"

echo ""
echo "检查 Node.js 版本..."
node --version

echo ""
echo "安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败，请检查网络连接"
    exit 1
fi

echo ""
echo "✅ 依赖安装完成"

echo ""
echo "启动开发服务器..."
echo "前端地址: http://localhost:8080"
echo ""

npm run dev:h5
