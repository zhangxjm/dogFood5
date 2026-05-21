#!/bin/bash

echo "🚀 正在启动露天停车场车位管理系统..."

if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
fi

echo "🔧 激活虚拟环境并安装依赖..."
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "✅ 系统启动完成！"
echo "🌐 请在浏览器中访问: http://localhost:5000"
echo ""
echo "📝 按 Ctrl+C 停止服务器"
echo ""

python app.py
