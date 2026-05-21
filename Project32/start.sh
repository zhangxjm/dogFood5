#!/bin/bash

echo "🚀 启动厂区员工出入登记系统"

echo "📦 下载Go依赖..."
go mod download

echo "🔧 编译项目..."
go build -o employee-access-system

echo "✅ 启动服务，访问地址: http://localhost:8080"
./employee-access-system
