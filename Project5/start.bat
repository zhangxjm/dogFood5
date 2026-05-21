@echo off
echo 🚀 启动跑腿服务平台...

echo 📦 启动 MongoDB...
docker-compose up -d

timeout /t 5

echo 📦 安装后端依赖...
cd backend
call npm install

echo 🔧 初始化服务类型数据...
node init-data.js

echo 🌐 启动后端服务 (端口 3000)...
start cmd /k "npm run start"

timeout /t 8

echo 📦 安装前端依赖...
cd ..\frontend
call npm install

echo 🌐 启动前端服务 (端口 5173)...
npm run dev

echo ✅ 所有服务已启动！
echo 📱 前端地址: http://localhost:5173
echo 🔧 后端地址: http://localhost:3000
