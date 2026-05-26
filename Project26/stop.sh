#!/bin/bash
if [ -f "$(dirname "$0")/.pids" ]; then
    pids=$(cat "$(dirname "$0")/.pids")
    kill $pids 2>/dev/null || true
    rm -f "$(dirname "$0")/.pids"
fi
docker rm -f gift-list-mongo > /dev/null 2>&1 || true
echo "服务已停止"
