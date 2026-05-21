#!/bin/bash

echo "🛑 停止鲜花门店预订小程序服务..."

echo ""
echo "📦 停止 Docker 服务..."
docker compose down

echo ""
echo "🗑️ 清理 Node 进程..."
pkill -f "nest start" || true
pkill -f "vite" || true

echo ""
echo "✅ 所有服务已停止！"
