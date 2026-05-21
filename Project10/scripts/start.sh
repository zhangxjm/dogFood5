#!/bin/bash

echo "🚀 启动亲子乐园预约系统..."

echo "📦 安装后端依赖..."
cd backend
pip install -q -r requirements.txt

echo "🗄️  初始化数据库..."
python init_data.py

echo "🌐 启动后端服务 (http://localhost:8000)..."
echo "📖 API文档: http://localhost:8000/docs"
echo ""
echo "💡 前端项目位于 frontend/ 目录"
echo "   请使用 HBuilderX 打开 frontend 目录运行小程序"
echo ""

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
