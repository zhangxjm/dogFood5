#!/bin/bash

echo "=== 重置数据库（解决乱码问题） ==="

echo "1. 停止后端服务..."
pkill -f "spring-boot" 2>/dev/null || true

echo "2. 停止并删除MySQL容器..."
docker-compose down -v

echo "3. 删除旧数据目录..."
rm -rf mysql/data

echo "4. 重新启动MySQL容器..."
docker-compose up -d

echo "5. 等待MySQL初始化完成（约30秒）..."
sleep 30

echo ""
echo "=== 数据库重置完成 ==="
echo "MySQL已重新初始化，数据应为UTF-8编码"
echo "请按以下步骤操作："
echo "1. cd backend"
echo "2. mvn spring-boot:run  (重启后端服务)"
echo ""
