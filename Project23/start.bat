@echo off
chcp 65001 >nul
echo 🚀 启动宠物用品门店管理系统...

echo 📦 安装后端依赖...
cd backend
call npm install

echo 📦 安装前端依赖...
cd ..\frontend
call npm install

echo 🔨 构建前端...
call npm run build

echo 🟢 启动后端服务...
cd ..\backend
start "后端服务" cmd /c "npm start"

echo ⏳ 等待后端启动完成...
timeout /t 3 /nobreak >nul

echo 🟢 启动前端开发服务...
cd ..\frontend
start "前端服务" cmd /c "npm run dev"

echo.
echo ✅ 系统启动完成！
echo 🌐 前端地址: http://localhost:5173
echo 🔌 后端API: http://localhost:3000
echo.
echo 请手动关闭打开的命令窗口以停止服务
pause
