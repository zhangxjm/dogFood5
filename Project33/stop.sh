#!/bin/bash

echo "=============================================="
echo "  母婴实体店会员信息管理系统 - 停止服务"
echo "=============================================="
echo ""

if command -v docker-compose &> /dev/null; then
    docker-compose down
else
    docker compose down
fi

echo ""
echo "✅ 服务已停止"
echo "=============================================="