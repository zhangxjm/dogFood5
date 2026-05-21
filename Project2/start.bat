@echo off
chcp 65001 >nul
echo =========================================
echo   设备维修报修系统 - 启动脚本
echo =========================================

echo.
echo 1. 启动 MySQL 和 phpMyAdmin...
docker-compose up -d

echo.
echo 2. 等待 MySQL 启动...
timeout /t 15 /nobreak

echo.
echo 3. 初始化后端依赖...
cd backend
go mod tidy
cd ..

echo.
echo 4. 初始化前端依赖...
cd frontend
npm install
cd ..

echo.
echo 5. 启动后端服务...
start "Backend" cmd /k "cd backend && go run main.go"

timeout /t 3

echo.
echo 6. 启动前端服务...
start "Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 5

echo.
echo =========================================
echo   系统启动完成！
echo =========================================
echo.
echo   服务地址：
echo   - 前端地址: http://localhost:5173
echo   - 后端API:  http://localhost:3000
echo   - phpMyAdmin: http://localhost:8080
echo.
echo   默认账号：
echo   - 用户名: admin
echo   - 密码: 123456
echo.
pause
