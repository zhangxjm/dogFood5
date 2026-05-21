#!/bin/bash

echo "🚀 启动节日礼品清单管理系统（开发模式）..."

echo "📦 安装根目录依赖..."
npm install

echo "📦 安装后端依赖..."
cd backend && npm install && cd ..

echo "📦 安装前端依赖..."
cd frontend && npm install && cd ..

echo "✅ 依赖安装完成！"
echo ""
echo "启动方式："
echo "1. 同时启动前后端: npm run dev"
echo "2. 仅启动后端: npm run dev:backend"
echo "3. 仅启动前端: npm run dev:frontend"
echo ""
echo "⚠️  请确保 MongoDB 已运行在 localhost:27017"
echo "   或使用 Docker 启动 MongoDB: docker run -d -p 27017:27017 mongo:6.0"
