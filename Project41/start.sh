#!/bin/bash

echo "=========================================="
echo "  生鲜果蔬采摘园预约入园系统 - 启动脚本"
echo "=========================================="

echo ""
echo "1. 启动 Docker 容器（MySQL + Redis）..."
docker-compose up -d

echo ""
echo "2. 等待 MySQL 初始化..."
sleep 15

echo ""
echo "3. 编译并启动 SpringBoot 后端..."
cd backend
mvn clean install -DskipTests
mvn spring-boot:run &
BACKEND_PID=$!

echo ""
echo "4. 后端服务启动中，端口: 8080"
echo "   API 基础路径: http://localhost:8080/api"

echo ""
echo "=========================================="
echo "  系统启动完成！"
echo "=========================================="
echo ""
echo "后端 API: http://localhost:8080/api"
echo ""
echo "可用 API 端点："
echo "  GET  /api/time-slot/list       - 获取时段列表"
echo "  POST /api/time-slot            - 创建时段"
echo "  POST /api/reservation          - 创建预约"
echo "  POST /api/reservation/checkin/{no} - 核销预约"
echo "  GET  /api/reservation/list/{phone} - 查询预约列表"
echo "  GET  /api/category/list        - 获取品类列表"
echo "  POST /api/category             - 创建品类"
echo ""
echo "前端项目位于 frontend 目录"
echo "请使用 HBuilderX 打开 frontend 目录运行小程序"
echo ""
echo "按 Ctrl+C 停止服务"

wait $BACKEND_PID
