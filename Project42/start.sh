#!/bin/bash

echo "========================================"
echo "  硬笔书法打卡系统 - 启动脚本"
echo "========================================"
echo ""

echo "正在启动 Docker 服务..."
docker-compose up -d

echo ""
echo "等待服务启动..."
sleep 10

echo ""
echo "正在初始化数据库..."
docker-compose exec -T web python init_db.py

echo ""
echo "========================================"
echo "  服务启动完成！"
echo "========================================"
echo ""
echo "API 文档地址: http://localhost:8000/docs"
echo "ReDoc 文档地址: http://localhost:8000/redoc"
echo ""
echo "默认账号："
echo "  管理员: admin / admin123"
echo "  演示用户: demo / demo123"
echo ""
echo "查看日志命令: docker-compose logs -f web"
echo "停止服务命令: docker-compose down"
echo ""
