#!/bin/bash
set -e

echo "============================================"
echo "  节日礼品清单管理系统 - 一键启动脚本 (macOS/Linux)"
echo "============================================"
echo

# 随机端口
MONGO_PORT=$((27000 + RANDOM % 2000))
BACKEND_PORT=$((8000 + RANDOM % 2000))
FRONTEND_PORT=$((5000 + RANDOM % 2000))

echo "[INFO] MongoDB 端口: $MONGO_PORT"
echo "[INFO] 后端 API 端口: $BACKEND_PORT"
echo "[INFO] 前端访问端口: $FRONTEND_PORT"
echo

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "[ERROR] 未检测到 Docker，请先安装"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] 未检测到 Node.js，请先安装 Node.js 16+"
    exit 1
fi

# 启动 MongoDB
echo "[1/5] 启动 MongoDB 容器..."
docker rm -f gift-list-mongo > /dev/null 2>&1 || true
docker run -d --name gift-list-mongo -p ${MONGO_PORT}:27017 mongo:6 --wiredEngineCacheSizeGB 0.25

# 等待 MongoDB
echo "[2/5] 等待 MongoDB 就绪..."
for i in $(seq 1 30); do
    if docker exec gift-list-mongo mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        echo "MongoDB 已就绪"
        break
    fi
    sleep 2
done
sleep 3

# 安装后端依赖
echo "[3/5] 安装后端依赖并初始化数据..."
cd "$(dirname "$0")/backend"
if [ ! -d node_modules ]; then
    npm install --no-audit --no-fund
fi
MONGO_HOST=localhost MONGO_PORT=$MONGO_PORT MONGO_DB=gift_list_db node seed.js || true

# 安装前端依赖
echo "[4/5] 安装前端依赖并构建..."
cd "$(dirname "$0")/frontend"
if [ ! -d node_modules ]; then
    npm install --no-audit --no-fund
fi
REACT_APP_API_BASE="http://localhost:${BACKEND_PORT}/api" CI=true npx react-scripts build

# 启动后端（后台）
echo "[5/5] 启动服务..."
cd "$(dirname "$0")/backend"
MONGO_HOST=localhost MONGO_PORT=$MONGO_PORT MONGO_DB=gift_list_db PORT=$BACKEND_PORT nohup node server.js > backend.log 2>&1 &
BACKEND_PID=$!

# 启动前端（后台）
sleep 2
cd "$(dirname "$0")/frontend"
PORT=$FRONTEND_PORT nohup node serve.js > frontend.log 2>&1 &
FRONTEND_PID=$!

echo
echo "============================================"
echo "  启动完成！"
echo "  前端访问: http://localhost:$FRONTEND_PORT"
echo "  后端 API: http://localhost:$BACKEND_PORT/api"
echo "  MongoDB : localhost:$MONGO_PORT"
echo "  停止服务: ./stop.sh"
echo "============================================"
echo "PID: backend=$BACKEND_PID frontend=$FRONTEND_PID"
echo "$BACKEND_PID $FRONTEND_PID" > "$(dirname "$0")/.pids"
