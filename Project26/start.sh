#!/bin/bash

echo "🎨 正在启动少儿绘画课时记录系统..."

echo "📦 检查依赖..."
python -c "import fastapi, uvicorn, sqlalchemy, streamlit, pandas, requests" 2>/dev/null || pip install -r requirements.txt

echo "🚀 启动后端服务 (端口 8000)..."
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload > backend.log 2>&1 &
BACKEND_PID=$!

echo "⏳ 等待后端服务启动..."
sleep 3

echo "🌐 启动前端界面 (端口 8501)..."
python -m streamlit run frontend/app.py --server.port 8501 --server.address 0.0.0.0 --server.headless true > frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "✅ 系统启动成功！"
echo ""
echo "📋 访问地址："
echo "   后端API: http://localhost:8000"
echo "   API文档: http://localhost:8000/docs"
echo "   前端界面: http://localhost:8501"
echo ""
echo "💡 按 Ctrl+C 停止服务"
echo ""

cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

trap cleanup INT TERM

wait $BACKEND_PID $FRONTEND_PID
